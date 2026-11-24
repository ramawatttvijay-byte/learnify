// Shared helpers: database, auth tokens, passwords, responses.
import crypto from 'node:crypto';

/* ---------------- database ---------------- */
let dbPromise = null;
export async function getDb() {
  if (globalThis.__lfTestDb) return globalThis.__lfTestDb;
  if (!dbPromise) {
    const uri = process.env.MONGODB_URI;
    if (!uri) throw httpError(500, 'MONGODB_URI is not set');
    const { MongoClient } = await import('mongodb');
    const client = new MongoClient(uri, { maxPoolSize: 5, serverSelectionTimeoutMS: 8000 });
    dbPromise = client.connect().then(c => c.db(process.env.MONGODB_DB || 'learnify')).catch(e => { dbPromise = null; throw e; });
  }
  return dbPromise;
}

export const newId = (p = '') => p + crypto.randomUUID().replace(/-/g, '').slice(0, 20);
export const now = () => new Date();

/* ---------------- errors + responses ---------------- */
export function httpError(status, message) { const e = new Error(message); e.status = status; return e; }
export function json(data, status = 200, headers = {}) {
  return new Response(JSON.stringify(data), { status, headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store', ...headers } });
}

/* ---------------- passwords ----------------
   New hashes: PBKDF2-SHA256 through Web Crypto ("p1$iterations$salt$hash"). It runs natively
   on both Netlify (Node) and Cloudflare Workers, so login stays fast on the free CPU budget.
   Old scrypt hashes ("s1$salt$hash") still verify, and are upgraded on the next login. */
const PW_ITER = () => Math.min(100000, Math.max(10000, Number(process.env.PW_ITER) || 60000));
async function pbkdf2(pw, saltHex, iter) {
  const key = await globalThis.crypto.subtle.importKey('raw', new TextEncoder().encode(pw), 'PBKDF2', false, ['deriveBits']);
  const bits = await globalThis.crypto.subtle.deriveBits({ name: 'PBKDF2', hash: 'SHA-256', salt: Buffer.from(saltHex, 'hex'), iterations: iter }, key, 256);
  return Buffer.from(bits);
}
export async function hashPassword(pw) {
  const salt = crypto.randomBytes(16).toString('hex'), iter = PW_ITER();
  return `p1$${iter}$${salt}$${(await pbkdf2(String(pw), salt, iter)).toString('hex')}`;
}
export async function checkPassword(pw, stored) {
  if (!stored) return false;
  const parts = String(stored).split('$');
  let got, want;
  if (parts[0] === 'p1' && parts.length === 4) { want = Buffer.from(parts[3], 'hex'); got = await pbkdf2(String(pw), parts[2], Number(parts[1])); }
  else if (parts[0] === 's1' && parts.length === 3) { want = Buffer.from(parts[2], 'hex'); got = crypto.scryptSync(String(pw), parts[1], 64); }
  else return false;
  return got.length === want.length && crypto.timingSafeEqual(got, want);
}
export const needsRehash = stored => !String(stored || '').startsWith('p1$');

/* ---------------- signed session tokens (JWT, HS256) ---------------- */
const b64u = b => Buffer.from(b).toString('base64url');
function secret() {
  const s = process.env.JWT_SECRET;
  if (!s || s.length < 24) throw httpError(500, 'JWT_SECRET is missing or too short');
  return s;
}
export function signToken(payload, days = 30) {
  const head = b64u(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const body = b64u(JSON.stringify({ ...payload, exp: Math.floor(Date.now() / 1000) + days * 86400 }));
  const sig = crypto.createHmac('sha256', secret()).update(`${head}.${body}`).digest('base64url');
  return `${head}.${body}.${sig}`;
}
export function verifyToken(tok) {
  if (!tok || tok.split('.').length !== 3) return null;
  const [head, body, sig] = tok.split('.');
  const want = crypto.createHmac('sha256', secret()).update(`${head}.${body}`).digest('base64url');
  if (sig.length !== want.length || !crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(want))) return null;
  try {
    const p = JSON.parse(Buffer.from(body, 'base64url').toString());
    if (!p.exp || p.exp < Date.now() / 1000) return null;
    return p;
  } catch { return null; }
}

export const COOKIE = 'lf_session';
export function sessionCookie(token, maxAgeDays = 30) {
  return `${COOKIE}=${token}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${maxAgeDays * 86400}`;
}
export const clearCookie = () => `${COOKIE}=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0`;
export function readCookie(req, name = COOKIE) {
  const c = req.headers.get('cookie') || '';
  const m = c.split(/;\s*/).find(x => x.startsWith(name + '='));
  return m ? decodeURIComponent(m.slice(name.length + 1)) : null;
}

/* ---------------- HMAC helpers (Razorpay) ---------------- */
export function hmacHex(key, text) { return crypto.createHmac('sha256', key).update(text).digest('hex'); }
export function safeEqual(a, b) {
  const x = Buffer.from(String(a || '')), y = Buffer.from(String(b || ''));
  return x.length === y.length && crypto.timingSafeEqual(x, y);
}

/* ---------------- small validators ---------------- */
export const isEmail = s => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(String(s || ''));
export const clean = (s, max = 500) => String(s ?? '').trim().slice(0, max);
export const isHttps = s => /^https:\/\/[^\s"'<>]+$/i.test(String(s || ''));
export function driveId(input) {
  const s = String(input || '').trim();
  if (!s) return '';
  const m = s.match(/\/file\/d\/([\w-]{20,})/) || s.match(/[?&]id=([\w-]{20,})/);
  if (m) return m[1];
  return /^[\w-]{20,}$/.test(s) ? s : '';
}

/* "riya.sharma@gmail.com" -> "ri•••••a@gmail.com": enough to recognise, not enough to leak */
export function maskEmail(e) {
  const [u, d] = String(e || '').split('@');
  if (!u || !d) return '';
  const keep = u.length <= 3 ? 1 : 2;
  return u.slice(0, keep) + '•'.repeat(Math.max(3, Math.min(6, u.length - keep - 1))) + (u.length > 3 ? u.slice(-1) : '') + '@' + d;
}
