// Cloudflare entry point.
// Pages, CSS, JS and images are served straight from ./public (free, unlimited, no badge).
// /api/* requests:
//   - if MONGODB_URI is set in Cloudflare, they run here, in one Durable Object that keeps a
//     single MongoDB connection open;
//   - until then, they are passed to the existing backend on Netlify (same code, same
//     database), so the site works fully in the meantime.
import { DurableObject } from 'cloudflare:workers';
import handler from './netlify/functions/api.mjs';

const FALLBACK_API = 'https://learnify-qvrc.netlify.app';

function loadEnv(env) {
  for (const [k, v] of Object.entries(env)) if (typeof v === 'string') process.env[k] = v;
}

export class Api extends DurableObject {
  constructor(state, env) { super(state, env); loadEnv(env); }
  async fetch(request) { return handler(request); }
}

async function proxy(request, base) {
  const url = new URL(request.url);
  const target = new URL(url.pathname + url.search, base);
  const headers = new Headers(request.headers);
  headers.delete('host');
  const init = { method: request.method, headers, redirect: 'manual' };
  if (!['GET', 'HEAD'].includes(request.method)) init.body = await request.arrayBuffer();
  const res = await fetch(target, init);
  const out = new Headers(res.headers);
  out.set('cache-control', 'no-store');
  return new Response(res.body, { status: res.status, headers: out });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === '/api/_diag') {
      // Public, non-secret setup check: which backend runs and which Razorpay Key ID it sees.
      const t = v => String(v || '').replace(/[\s"'`]/g, '');
      const id = t(env.RAZORPAY_KEY_ID), sec = t(env.RAZORPAY_KEY_SECRET);
      return Response.json({ backend: env.MONGODB_URI ? 'cloudflare' : 'netlify-fallback', keyId: id || null,
        secretChars: sec.length, mode: id.startsWith('rzp_live_') ? 'live' : id.startsWith('rzp_test_') ? 'test' : 'unknown',
        at: new Date().toISOString() }, { headers: { 'cache-control': 'no-store' } });
    }
    if (url.pathname === '/api' || url.pathname.startsWith('/api/')) {
      if (!env.MONGODB_URI) {
        const r = await proxy(request, env.API_FALLBACK || FALLBACK_API);
        const h = new Headers(r.headers); h.set('x-lf-backend', 'netlify-fallback');
        return new Response(r.body, { status: r.status, headers: h });
      }
      const id = env.API.idFromName('main');
      const res = await env.API.get(id, { locationHint: 'apac' }).fetch(request); // near the Mumbai database
      if (res.status >= 400 && url.pathname.startsWith('/api/pay/')) {
        const text = await res.clone().text();
        console.log('API error', res.status, url.pathname, text.slice(0, 400)); // visible in Cloudflare logs
      }
      return res;
    }
    if (url.pathname === '/robots.txt')
      return new Response(`User-agent: *\nAllow: /\nDisallow: /api/\nSitemap: ${url.origin}/sitemap.xml\n`, { headers: { 'content-type': 'text/plain; charset=utf-8', 'cache-control': 'public, max-age=3600' } });
    if (url.pathname === '/sitemap.xml')
      return new Response(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${url.origin}/</loc><changefreq>weekly</changefreq><priority>1.0</priority></url></urlset>\n`, { headers: { 'content-type': 'application/xml; charset=utf-8', 'cache-control': 'public, max-age=3600' } });
    const res = await env.ASSETS.fetch(request);
    // Share previews and search engines need absolute links: fill in whichever domain the site runs on.
    if ((url.pathname === '/' || url.pathname === '/index.html') && res.ok && (res.headers.get('content-type') || '').includes('text/html')) {
      const html = (await res.text()).replaceAll('__ORIGIN__', url.origin);
      const h = new Headers(res.headers); h.delete('content-length');
      return new Response(html, { status: res.status, headers: h });
    }
    return res;
  }
};
