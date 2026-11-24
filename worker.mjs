// Cloudflare entry point.
// Pages, CSS, JS and images are served straight from ./public (free, unlimited).
// Every /api/* request goes to one Durable Object, which keeps a single MongoDB
// connection open, so each request is fast (no new database login every time).
import { DurableObject } from 'cloudflare:workers';
import handler from './netlify/functions/api.mjs';

function loadEnv(env) {
  for (const [k, v] of Object.entries(env)) if (typeof v === 'string') process.env[k] = v;
}

export class Api extends DurableObject {
  constructor(state, env) { super(state, env); loadEnv(env); }
  async fetch(request) { return handler(request); }
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === '/api' || url.pathname.startsWith('/api/')) {
      const id = env.API.idFromName('main');
      return env.API.get(id, { locationHint: 'apac' }).fetch(request); // near the Mumbai database
    }
    return env.ASSETS.fetch(request);
  }
};
