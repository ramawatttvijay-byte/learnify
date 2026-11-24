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
    if (url.pathname === '/api' || url.pathname.startsWith('/api/')) {
      if (!env.MONGODB_URI) return proxy(request, env.API_FALLBACK || FALLBACK_API);
      const id = env.API.idFromName('main');
      const res = await env.API.get(id, { locationHint: 'apac' }).fetch(request); // near the Mumbai database
      if (res.status >= 400 && url.pathname.startsWith('/api/pay/')) {
        const text = await res.clone().text();
        console.log('API error', res.status, url.pathname, text.slice(0, 400)); // visible in Cloudflare logs
      }
      return res;
    }
    return env.ASSETS.fetch(request);
  }
};
