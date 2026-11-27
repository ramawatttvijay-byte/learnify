// Learnify API: one handler for every /api/* route (Cloudflare Worker via worker.mjs, or Netlify Function).
import {
  getDb, newId, now, httpError, json, hashPassword, checkPassword, needsRehash, signToken, verifyToken,
  sessionCookie, clearCookie, readCookie, hmacHex, safeEqual, isEmail, clean, isHttps, driveId, maskEmail
} from './lib/core.mjs';

export const config = { path: '/api/*' };

/* Default skills, used until the admin saves a course in the database. */
const DEFAULT_COURSES = {
  'meta-ads': { t: 'Meta Ads Mastery Course', price: 2499, status: 'live' },
  'content-creation': { t: 'Content Creation', price: 2499, status: 'soon' },
  'affiliate-marketing': { t: 'Affiliate Marketing Blueprint', price: 2499, status: 'soon' },
  'ai-for-work': { t: 'AI & Automation', price: 2499, status: 'soon' },
  'web-development': { t: 'Web Development', price: 2499, status: 'soon' }
};
const PUBLIC_COLS = ['reviews', 'jobs', 'missions', 'packages'];
const DAY = 864e5;

/* ---------------- router ---------------- */
const routes = [];
const on = (method, pattern, handler, opts = {}) => {
  const keys = [];
  const re = new RegExp('^' + pattern.replace(/:(\w+)/g, (_, k) => { keys.push(k); return '([^/]+)'; }) + '/?$');
  routes.push({ method, re, keys, handler, ...opts });
};

export default async function handler(req) {
  const url = new URL(req.url);
  const path = url.pathname.replace(/^\/(\.netlify\/functions\/)?api/, '') || '/';
  try {
    for (const r of routes) {
      if (r.method !== req.method) continue;
      const m = path.match(r.re);
      if (!m) continue;
      const params = Object.fromEntries(r.keys.map((k, i) => [k, decodeURIComponent(m[i + 1])]));
      const raw = ['POST', 'PUT', 'PATCH'].includes(req.method) ? await req.text() : '';
      let body = {};
      if (raw && !r.raw) { try { body = JSON.parse(raw); } catch { throw httpError(400, 'Invalid JSON'); } }
      const db = await getDb();
      const user = await currentUser(req, db);
      if (r.auth && !user) throw httpError(401, 'Please log in');
      if (r.admin && user?.role !== 'admin') throw httpError(403, 'Admins only');
      return await r.handler({ req, url, params, body, raw, db, user });
    }
    return json({ error: 'Not found' }, 404);
  } catch (e) {
    const status = e.status || 500;
    if (status >= 500) console.error(e);
    return json({ error: status >= 500 ? 'Server error, please try again' : e.message }, status);
  }
}

async function currentUser(req, db) {
  const p = verifyToken(readCookie(req));
  if (!p) return null;
  const u = await db.collection('users').findOne({ _id: p.uid });
  if (!u || u.sv !== p.sv || u.blocked) return null; // sv = one device at a time
  return u;
}

const adminList = () => String(process.env.ADMIN_EMAILS || '').toLowerCase().split(',').map(s => s.trim()).filter(Boolean);
const publicUser = u => ({ id: u._id, name: u.name, email: u.email, phone: u.phone || '', city: u.city || '', about: u.about || '', role: u.role, code: u.code, plan: u.plan || '', avatar: u.avatar || '', createdAt: u.createdAt });
/* what other students may see about a person: name, photo, masked email */
const person = u => u ? { n: u.name, av: u.avatar || '', em: maskEmail(u.email) } : { n: 'Learner', av: '', em: '' };
async function peopleById(db, ids) {
  const list = ids.length ? await db.collection('users').find({ _id: { $in: [...new Set(ids)] } }).toArray() : [];
  return Object.fromEntries(list.map(u => [u._id, person(u)]));
}

async function startSession(db, user) {
  const sv = (user.sv || 0) + 1; // logging in here signs out every other device
  await db.collection('users').updateOne({ _id: user._id }, { $set: { sv, lastLoginAt: now() } });
  const token = signToken({ uid: user._id, sv });
  return sessionCookie(token);
}

async function makeCode(db, name) {
  const base = (String(name).replace(/[^a-z]/gi, '').toUpperCase().slice(0, 6) || 'LEARN');
  for (let i = 0; i < 20; i++) {
    const code = base + Math.floor(1000 + Math.random() * 9000);
    if (!(await db.collection('users').findOne({ code }))) return code;
  }
  return base + Date.now().toString().slice(-6);
}

/* ---------------- auth ---------------- */
on('GET', '/health', async () => json({ ok: true }));

on('POST', '/auth/signup', async ({ body, db }) => {
  const name = clean(body.name, 80), email = clean(body.email, 120).toLowerCase(), phone = clean(body.phone, 20).replace(/[^\d+]/g, '');
  const password = String(body.password || '');
  if (name.length < 2) throw httpError(400, 'Please enter your name');
  if (!isEmail(email)) throw httpError(400, 'Please enter a valid email');
  if (password.length < 8) throw httpError(400, 'Password must be at least 8 characters');
  if (await db.collection('users').findOne({ email })) throw httpError(409, 'An account with this email already exists. Please log in.');
  let referredBy = null;
  const ref = clean(body.ref, 20).toUpperCase();
  if (ref) { const r = await db.collection('users').findOne({ code: ref }); if (r) referredBy = r._id; }
  const user = {
    _id: newId('u_'), name, email, phone, passwordHash: await hashPassword(password),
    role: adminList().includes(email) ? 'admin' : 'student', code: await makeCode(db, name),
    referredBy, sv: 0, createdAt: now()
  };
  await db.collection('users').insertOne(user);
  const cookie = await startSession(db, user);
  return json({ user: publicUser(user) }, 201, { 'set-cookie': cookie });
});

on('POST', '/auth/login', async ({ body, db }) => {
  const email = clean(body.email, 120).toLowerCase();
  const user = await db.collection('users').findOne({ email });
  if (user?.lockUntil && new Date(user.lockUntil) > now()) throw httpError(429, 'Too many tries. Please wait 15 minutes.');
  if (!user || !(await checkPassword(String(body.password || ''), user.passwordHash))) {
    if (user) {
      const fails = (user.fails || 0) + 1;
      await db.collection('users').updateOne({ _id: user._id }, { $set: { fails, lockUntil: fails >= 5 ? new Date(Date.now() + 15 * 60e3) : null } });
    }
    throw httpError(401, 'Wrong email or password');
  }
  const role = adminList().includes(email) ? 'admin' : (user.role === 'admin' ? 'admin' : 'student');
  const upd = { fails: 0, lockUntil: null, role };
  if (needsRehash(user.passwordHash)) upd.passwordHash = await hashPassword(String(body.password));
  await db.collection('users').updateOne({ _id: user._id }, { $set: upd });
  user.role = role;
  const cookie = await startSession(db, user);
  return json({ user: publicUser(user) }, 200, { 'set-cookie': cookie });
});

on('POST', '/auth/logout', async ({ db, user }) => {
  if (user) await db.collection('users').updateOne({ _id: user._id }, { $set: { sv: (user.sv || 0) + 1 } });
  return json({ ok: true }, 200, { 'set-cookie': clearCookie() });
});

on('GET', '/me', async ({ db, user }) => {
  if (!user) return json({ user: null });
  const enr = await db.collection('enrollments').find({ userId: user._id, active: true }).toArray();
  return json({ user: publicUser(user), enrolled: enr.map(e => e.slug) });
});

on('PUT', '/me', async ({ db, user, body }) => {
  const set = { name: clean(body.name, 80) || user.name, phone: clean(body.phone, 20).replace(/[^\d+]/g, ''), city: clean(body.city, 60), about: clean(body.about, 300) };
  await db.collection('users').updateOne({ _id: user._id }, { $set: set });
  return json({ user: publicUser({ ...user, ...set }) });
}, { auth: true });

on('POST', '/me/avatar', async ({ db, user, body }) => {
  const m = String(body.data || '').match(/^data:(image\/(webp|jpeg|png));base64,([A-Za-z0-9+/=]+)$/);
  if (!m) throw httpError(400, 'Please upload a JPG, PNG or WebP photo');
  if (m[3].length > 300000) throw httpError(400, 'Photo is too large');
  const id = newId('a_');
  await db.collection('images').insertOne({ _id: id, type: m[1], data: m[3], owner: user._id, createdAt: now() });
  if (user.avatar) await db.collection('images').deleteOne({ _id: user.avatar, owner: user._id });
  await db.collection('users').updateOne({ _id: user._id }, { $set: { avatar: id } });
  return json({ avatar: id });
}, { auth: true });

on('DELETE', '/me/avatar', async ({ db, user }) => {
  if (user.avatar) await db.collection('images').deleteOne({ _id: user.avatar, owner: user._id });
  await db.collection('users').updateOne({ _id: user._id }, { $set: { avatar: '' } });
  return json({ avatar: '' });
}, { auth: true });

on('POST', '/me/password', async ({ db, user, body }) => {
  if (!(await checkPassword(String(body.current || ''), user.passwordHash))) throw httpError(400, 'Current password is wrong');
  if (String(body.next || '').length < 8) throw httpError(400, 'New password must be at least 8 characters');
  await db.collection('users').updateOne({ _id: user._id }, { $set: { passwordHash: await hashPassword(body.next) } });
  return json({ ok: true });
}, { auth: true });

/* ---------------- public site data ---------------- */
function stripCourse(c, full) {
  const out = { ...c, s: c._id };
  delete out._id;
  out.modules = (c.modules || []).map(m => {
    const o = { t: m.t, d: m.d || '' };
    if (m.free) o.free = true;
    if (full || m.free) { if (m.drive) o.drive = m.drive; }
    else if (m.drive) o.locked = true;
    return o;
  });
  return out;
}

on('GET', '/public', async ({ db, user, url }) => {
  const full = user?.role === 'admin' && url.searchParams.get('admin') === '1';
  const [courses, settingsDoc, ...cols] = await Promise.all([
    db.collection('courses').find({}).toArray(),
    db.collection('site').findOne({ _id: 'settings' }),
    ...PUBLIC_COLS.map(c => db.collection(c).find({}).sort({ ts: -1 }).limit(200).toArray())
  ]);
  const s = settingsDoc || {};
  const settings = { wa: s.wa || '', social: s.social || {}, vijay: s.vijay || '', akash: s.akash || '' };
  if (full) Object.assign(settings, { commission: s.commission ?? 625, holdDays: s.holdDays ?? 7, minPayout: s.minPayout ?? 500 });
  const data = { courses: courses.map(c => stripCourse(c, full)), settings };
  PUBLIC_COLS.forEach((c, i) => { data[c] = cols[i].map(d => { const o = { ...d, id: d._id }; delete o._id; return o; }); });
  return json(data, 200, full ? {} : { 'cache-control': 'public, max-age=30, stale-while-revalidate=300' });
});

on('GET', '/img/:id', async ({ db, params }) => {
  const img = await db.collection('images').findOne({ _id: params.id });
  if (!img) return new Response('Not found', { status: 404 });
  return new Response(Buffer.from(img.data, 'base64'), { headers: { 'content-type': img.type, 'cache-control': 'public, max-age=31536000, immutable' } });
});

/* ---------------- learning ---------------- */
async function isEnrolled(db, userId, slug) {
  return !!(await db.collection('enrollments').findOne({ _id: `${userId}:${slug}`, active: true }));
}

on('GET', '/learn/:slug', async ({ db, user, params }) => {
  const c = await db.collection('courses').findOne({ _id: params.slug });
  const base = DEFAULT_COURSES[params.slug];
  if (!c && !base) throw httpError(404, 'Course not found');
  const ok = user.role === 'admin' || await isEnrolled(db, user._id, params.slug);
  if (!ok) return json({ enrolled: false, course: c ? stripCourse(c, false) : { s: params.slug, ...base, modules: [] } }, 403);
  const prog = await db.collection('progress').findOne({ _id: `${user._id}:${params.slug}` });
  return json({ enrolled: true, course: c ? stripCourse(c, true) : { s: params.slug, ...base, modules: [] }, done: prog?.done || [], watermark: user.phone || user.email });
}, { auth: true });

on('POST', '/progress', async ({ db, user, body }) => {
  const slug = clean(body.slug, 60), i = Number(body.lesson);
  if (!Number.isInteger(i) || i < 0 || i > 500) throw httpError(400, 'Bad lesson');
  if (user.role !== 'admin' && !(await isEnrolled(db, user._id, slug))) throw httpError(403, 'Not enrolled');
  const id = `${user._id}:${slug}`;
  const prog = await db.collection('progress').findOne({ _id: id });
  const done = Array.from(new Set([...(prog?.done || []), i])).sort((a, b) => a - b);
  await db.collection('progress').updateOne({ _id: id }, { $set: { userId: user._id, slug, done, updatedAt: now() } }, { upsert: true });
  return json({ done });
}, { auth: true });

/* ---------------- certificates ---------------- */
const certId = (uid, slug) => 'LF-' + hmacHex(process.env.JWT_SECRET || 'lf', uid + ':' + slug).slice(0, 10).toUpperCase();
on('GET', '/certificate/:slug', async ({ db, user, params }) => {
  const slug = params.slug;
  if (!(await isEnrolled(db, user._id, slug)) && user.role !== 'admin') throw httpError(403, 'Not enrolled');
  const c = (await db.collection('courses').findOne({ _id: slug })) || DEFAULT_COURSES[slug];
  if (!c) throw httpError(404, 'Course not found');
  const n = (c.modules || []).length;
  const prog = await db.collection('progress').findOne({ _id: `${user._id}:${slug}` });
  const done = (prog?.done || []).filter(i => i < n).length;
  if (!n || done < n) return json({ ready: false, done, total: n });
  const id = certId(user._id, slug);
  const ex = await db.collection('certificates').findOne({ _id: id });
  const issued = ex?.issuedAt || prog.updatedAt || now();
  if (!ex) await db.collection('certificates').insertOne({ _id: id, userId: user._id, name: user.name, slug, course: c.t, mentor: c.by || 'Learnify Mentors', issuedAt: issued });
  return json({ ready: true, id, name: user.name, avatar: user.avatar || '', course: c.t, mentor: c.by || 'Learnify Mentors', issuedAt: issued, lessons: n });
}, { auth: true });

on('GET', '/verify/:id', async ({ db, params }) => {
  const c = await db.collection('certificates').findOne({ _id: clean(params.id, 20).toUpperCase() });
  if (!c) return json({ valid: false }, 404);
  return json({ valid: true, id: c._id, name: c.name, course: c.course, issuedAt: c.issuedAt });
});

/* ---------------- live updates for the dashboard bell ---------------- */
on('GET', '/pulse', async ({ db, user, url }) => {
  const since = new Date(url.searchParams.get('since') || Date.now() - DAY);
  const [cs, ps] = await Promise.all([
    db.collection('commissions').find({ affiliateId: user._id, createdAt: { $gt: since } }).toArray(),
    db.collection('payouts').find({ userId: user._id, doneAt: { $gt: since } }).toArray()
  ]);
  const items = [
    ...cs.map(c => ({ t: 'sale', d: c.createdAt, title: 'New sale · +₹' + c.amount, body: `${c.buyerName} joined ${c.title}` })),
    ...ps.map(p => ({ t: 'payout', d: p.doneAt, title: p.status === 'paid' ? 'Payout sent · ₹' + p.amount : 'Payout rejected', body: p.status === 'paid' ? 'Sent to your ' + (p.method === 'bank' ? 'bank account' : 'UPI') : (p.note || 'Please check your KYC details') }))
  ].sort((a, b) => new Date(b.d) - new Date(a.d));
  return json({ now: new Date().toISOString(), items });
}, { auth: true });

/* ---------------- payments (Razorpay) ---------------- */
async function priceOf(db, kind, id) {
  if (kind === 'course') {
    const c = (await db.collection('courses').findOne({ _id: id })) || DEFAULT_COURSES[id];
    if (!c) throw httpError(404, 'Course not found');
    if (c.status !== 'live') throw httpError(400, 'This course is not open for enrolment yet');
    if (!c.price) throw httpError(400, 'Price not set');
    return { amount: Math.round(c.price), title: c.t, slugs: [id] };
  }
  if (kind === 'package') {
    const p = await db.collection('packages').findOne({ _id: id });
    if (!p || !p.price) throw httpError(400, 'This package is not available for online payment');
    let slugs = String(p.courses || 'all').toLowerCase().trim() === 'all'
      ? [...new Set([...Object.keys(DEFAULT_COURSES), ...(await db.collection('courses').find({}).toArray()).map(c => c._id)])]
      : String(p.courses).split(',').map(s => s.trim()).filter(Boolean);
    const hidden = new Set((await db.collection('courses').find({ status: 'hidden' }).toArray()).map(c => c._id));
    slugs = slugs.filter(s => !hidden.has(s));
    return { amount: Math.round(p.price), title: p.t + ' package', slugs };
  }
  throw httpError(400, 'Unknown item');
}

// Keys pasted into a dashboard often carry spaces, line breaks or quotes; strip them.
const rk = n => String(process.env[n] || '').replace(/[\s"'`]/g, '');
async function razorpay(path, payload) {
  const id = rk('RAZORPAY_KEY_ID'), sec = rk('RAZORPAY_KEY_SECRET');
  if (!id || !sec) throw httpError(500, 'Razorpay keys are not set');
  const r = await fetch('https://api.razorpay.com/v1' + path, {
    method: 'POST', headers: { 'content-type': 'application/json', authorization: 'Basic ' + Buffer.from(`${id}:${sec}`).toString('base64') },
    body: JSON.stringify(payload)
  });
  const data = await r.json().catch(() => ({}));
  if (!r.ok) {
    const why = data?.error?.description || ('HTTP ' + r.status);
    console.error('Razorpay error', r.status, JSON.stringify(data));
    const seen = ` [server key: ${id}, secret: ${sec.length} chars${/^rzp_(test|live)_/.test(id) ? '' : ', Key ID should start with rzp_test_ or rzp_live_'}]`;
    throw httpError(424, r.status === 401 ? 'Payment setup error: Razorpay keys are wrong (' + why + ')' + seen : 'Payment service error: ' + why);
  }
  return data;
}

on('POST', '/pay/order', async ({ db, user, body }) => {
  const kind = clean(body.kind, 10), id = clean(body.id, 60);
  const item = await priceOf(db, kind, id);
  const owned = await db.collection('enrollments').find({ userId: user._id, active: true }).toArray();
  const have = new Set(owned.map(e => e.slug));
  if (item.slugs.every(s => have.has(s))) throw httpError(409, 'You already have this course');
  const orderId = newId('o_');
  const rp = await razorpay('/orders', { amount: item.amount * 100, currency: 'INR', receipt: orderId, notes: { orderId, userId: user._id, kind, id } });
  await db.collection('orders').insertOne({
    _id: orderId, rpOrderId: rp.id, userId: user._id, userName: user.name, userEmail: user.email, kind, itemId: id,
    title: item.title, slugs: item.slugs, amount: item.amount, status: 'created', referredBy: user.referredBy || null, createdAt: now()
  });
  return json({ keyId: rk('RAZORPAY_KEY_ID'), rpOrderId: rp.id, amount: item.amount * 100, title: item.title, name: user.name, email: user.email, phone: user.phone || '' });
}, { auth: true });

async function fulfil(db, rpOrderId, paymentId) {
  const order = await db.collection('orders').findOne({ rpOrderId });
  if (!order) return null;
  const res = await db.collection('orders').updateOne({ _id: order._id, status: { $ne: 'paid' } }, { $set: { status: 'paid', paymentId, paidAt: now() } });
  if (!res.modifiedCount) return order; // already done (webhook + verify both arrive)
  for (const slug of order.slugs) {
    await db.collection('enrollments').updateOne({ _id: `${order.userId}:${slug}` },
      { $set: { userId: order.userId, slug, active: true, orderId: order._id, updatedAt: now() }, $setOnInsert: { createdAt: now() } }, { upsert: true });
  }
  if (order.referredBy && order.referredBy !== order.userId) {
    const s = (await db.collection('site').findOne({ _id: 'settings' })) || {};
    await db.collection('commissions').updateOne({ _id: 'c_' + order._id }, {
      $setOnInsert: {
        affiliateId: order.referredBy, orderId: order._id, buyerName: order.userName, title: order.title,
        amount: Number(s.commission ?? 625), status: 'pending', releaseAt: new Date(Date.now() + (s.holdDays ?? 7) * DAY), createdAt: now()
      }
    }, { upsert: true });
  }
  return order;
}

on('POST', '/pay/verify', async ({ db, user, body }) => {
  const { razorpay_order_id: o, razorpay_payment_id: p, razorpay_signature: sig } = body;
  if (!o || !p || !sig) throw httpError(400, 'Missing payment details');
  const want = hmacHex(rk('RAZORPAY_KEY_SECRET'), `${o}|${p}`);
  if (!safeEqual(want, sig)) throw httpError(400, 'Payment could not be verified');
  const order = await fulfil(db, o, p);
  if (!order || order.userId !== user._id) throw httpError(404, 'Order not found');
  return json({ ok: true, slugs: order.slugs });
}, { auth: true });

on('POST', '/pay/webhook', async ({ req, db, raw }) => {
  const sig = req.headers.get('x-razorpay-signature');
  const want = hmacHex(rk('RAZORPAY_WEBHOOK_SECRET'), raw);
  if (!sig || !safeEqual(want, sig)) throw httpError(400, 'Bad signature');
  const ev = JSON.parse(raw);
  if (ev.event === 'payment.captured') { const pe = ev.payload.payment.entity; await fulfil(db, pe.order_id, pe.id); }
  if (ev.event === 'order.paid') { const oe = ev.payload.order.entity; const pe = ev.payload.payment?.entity; await fulfil(db, oe.id, pe?.id || ''); }
  if (ev.event === 'refund.processed') {
    const pid = ev.payload.refund.entity.payment_id;
    const order = await db.collection('orders').findOne({ paymentId: pid });
    if (order && order.status !== 'refunded') {
      await db.collection('orders').updateOne({ _id: order._id }, { $set: { status: 'refunded', refundedAt: now() } });
      for (const slug of order.slugs) await db.collection('enrollments').updateOne({ _id: `${order.userId}:${slug}`, orderId: order._id }, { $set: { active: false } });
      await db.collection('commissions').updateOne({ _id: 'c_' + order._id, status: { $ne: 'paid' } }, { $set: { status: 'cancelled' } });
    }
  }
  return json({ ok: true });
}, { raw: true });

/* ---------------- affiliate ---------------- */
const effStatus = c => (c.status === 'pending' && new Date(c.releaseAt) <= now() ? 'approved' : c.status);
async function walletOf(db, userId) {
  const cs = await db.collection('commissions').find({ affiliateId: userId }).toArray();
  const ps = await db.collection('payouts').find({ userId }).toArray();
  const approved = cs.filter(c => effStatus(c) === 'approved' || c.status === 'paid').reduce((a, c) => a + c.amount, 0);
  const pending = cs.filter(c => effStatus(c) === 'pending').reduce((a, c) => a + c.amount, 0);
  const out = ps.filter(p => p.status !== 'rejected').reduce((a, p) => a + p.amount, 0);
  return { cs, ps, approved, pending, balance: Math.max(0, approved - out) };
}

on('GET', '/affiliate', async ({ db, user }) => {
  const { cs, ps, pending, balance } = await walletOf(db, user._id);
  const live = cs.filter(c => c.status !== 'cancelled');
  const t = Date.now(), sod = new Date(); sod.setHours(0, 0, 0, 0);
  const sum = since => live.filter(c => new Date(c.createdAt) >= since).reduce((a, c) => a + c.amount, 0);
  const cnt = since => live.filter(c => new Date(c.createdAt) >= since).length;
  const week = Array.from({ length: 7 }, (_, i) => {
    const d0 = new Date(sod.getTime() - (6 - i) * DAY), d1 = new Date(d0.getTime() + DAY);
    return { d: d0.toISOString(), v: live.filter(c => new Date(c.createdAt) >= d0 && new Date(c.createdAt) < d1).reduce((a, c) => a + c.amount, 0) };
  });
  const s = (await db.collection('site').findOne({ _id: 'settings' })) || {};
  const refs = await db.collection('users').find({ referredBy: user._id }).sort({ createdAt: -1 }).limit(100).toArray();
  const recent = live.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 100);
  const ords = recent.length ? await db.collection('orders').find({ _id: { $in: recent.map(c => c.orderId) } }).toArray() : [];
  const buyerOf = Object.fromEntries(ords.map(o => [o._id, o.userId]));
  const ppl = await peopleById(db, Object.values(buyerOf));
  return json({
    code: user.code, commission: s.commission ?? 625, minPayout: s.minPayout ?? 500,
    today: sum(sod), todayN: cnt(sod), d7: sum(new Date(t - 7 * DAY)), d7N: cnt(new Date(t - 7 * DAY)),
    d30: sum(new Date(t - 30 * DAY)), d30N: cnt(new Date(t - 30 * DAY)), all: live.reduce((a, c) => a + c.amount, 0), allN: live.length,
    pending, balance, week,
    sales: recent.map(c => { const p = ppl[buyerOf[c.orderId]] || {}; return { d: c.createdAt, name: c.buyerName, av: p.av || '', em: p.em || '', course: c.title, amt: c.amount, st: effStatus(c) }; }),
    payouts: ps.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map(p => ({ d: p.createdAt, amt: p.amount, mode: p.method, st: p.status })),
    referrals: refs.map(r => ({ name: r.name, av: r.avatar || '', em: maskEmail(r.email), d: r.createdAt }))
  });
}, { auth: true });

on('GET', '/leaderboard', async ({ db, url, user }) => {
  const range = url.searchParams.get('range') || 'all';
  const since = { today: new Date(new Date().setHours(0, 0, 0, 0)), '7d': new Date(Date.now() - 7 * DAY), '30d': new Date(Date.now() - 30 * DAY) }[range];
  const q = { status: { $ne: 'cancelled' } };
  if (since) q.createdAt = { $gte: since };
  const cs = await db.collection('commissions').find(q).toArray();
  const tot = {};
  cs.forEach(c => { tot[c.affiliateId] = (tot[c.affiliateId] || 0) + c.amount; });
  const top = Object.entries(tot).sort((a, b) => b[1] - a[1]).slice(0, 20);
  const ppl = await peopleById(db, top.map(t => t[0]));
  const all = Object.entries(tot).sort((a, b) => b[1] - a[1]);
  const mine = all.findIndex(([id]) => id === user._id);
  return json({ range, top: top.map(([id, v]) => ({ ...(ppl[id] || person(null)), v, me: id === user._id || undefined })), myRank: mine < 0 ? null : mine + 1, myTotal: mine < 0 ? 0 : all[mine][1] });
}, { auth: true });

on('POST', '/payouts', async ({ db, user, body }) => {
  const kyc = await db.collection('kyc').findOne({ _id: user._id });
  if (!kyc || kyc.status !== 'approved') throw httpError(400, 'Please complete KYC first. The team approves it within 2 working days.');
  const s = (await db.collection('site').findOne({ _id: 'settings' })) || {};
  const amount = Math.round(Number(body.amount));
  const { balance } = await walletOf(db, user._id);
  if (!(amount >= (s.minPayout ?? 500))) throw httpError(400, `Minimum withdrawal is ₹${s.minPayout ?? 500}`);
  if (amount > balance) throw httpError(400, 'Amount is more than your available balance');
  const method = body.method === 'bank' ? 'Bank transfer' : 'UPI';
  await db.collection('payouts').insertOne({ _id: newId('p_'), userId: user._id, userName: user.name, amount, method, status: 'pending', createdAt: now() });
  return json({ ok: true });
}, { auth: true });

on('GET', '/kyc', async ({ db, user }) => {
  const k = await db.collection('kyc').findOne({ _id: user._id });
  return json({ status: k?.status || 'none', note: k?.note || '' });
}, { auth: true });

on('POST', '/kyc', async ({ db, user, body }) => {
  const pan = clean(body.pan, 10).toUpperCase();
  if (!/^[A-Z]{5}\d{4}[A-Z]$/.test(pan)) throw httpError(400, 'Please enter a valid PAN');
  const upi = clean(body.upi, 80), acc = clean(body.account, 20).replace(/\D/g, ''), ifsc = clean(body.ifsc, 11).toUpperCase();
  if (!upi && !(acc && /^[A-Z]{4}0[A-Z0-9]{6}$/.test(ifsc))) throw httpError(400, 'Add a UPI ID, or a bank account with a valid IFSC');
  await db.collection('kyc').updateOne({ _id: user._id }, { $set: {
    userId: user._id, userName: user.name, name: clean(body.name, 80), pan, upi, account: acc, ifsc, holder: clean(body.holder, 80),
    status: 'submitted', note: '', updatedAt: now()
  } }, { upsert: true });
  return json({ ok: true, status: 'submitted' });
}, { auth: true });

/* ---------------- admin ---------------- */
on('PUT', '/admin/courses/:slug', async ({ db, params, body }) => {
  const slug = params.slug;
  if (!/^[a-z0-9][a-z0-9-]{1,48}$/.test(slug)) throw httpError(400, 'Bad course address');
  const modules = (Array.isArray(body.modules) ? body.modules : []).slice(0, 300).map(m => {
    const o = { t: clean(m.t, 160), d: clean(m.d, 400) };
    const id = driveId(m.drive || m.url);
    if (id) o.drive = id;
    if (m.free) o.free = true;
    return o;
  }).filter(m => m.t);
  const doc = {
    t: clean(body.t, 120), cat: clean(body.cat, 60), by: clean(body.by, 80), d: clean(body.d, 600),
    price: Math.max(0, Math.round(Number(body.price) || 0)), status: ['live', 'soon', 'hidden'].includes(body.status) ? body.status : 'soon',
    pay: isHttps(body.pay) ? body.pay : '', thumb: clean(body.thumb, 60), img: clean(body.img, 300), ord: Number(body.ord) || 0, modules, updatedAt: now()
  };
  if (!doc.t) throw httpError(400, 'Course title is required');
  await db.collection('courses').updateOne({ _id: slug }, { $set: doc }, { upsert: true });
  return json({ ok: true });
}, { admin: true });

on('DELETE', '/admin/courses/:slug', async ({ db, params }) => {
  await db.collection('courses').deleteOne({ _id: params.slug });
  return json({ ok: true });
}, { admin: true });

on('PUT', '/admin/settings', async ({ db, body }) => {
  const social = {};
  for (const k of ['whatsapp', 'instagram', 'youtube', 'telegram', 'facebook', 'x']) { const v = clean(body.social?.[k], 300); if (v && isHttps(v)) social[k] = v; }
  const set = { wa: clean(body.wa, 15).replace(/\D/g, ''), social, vijay: clean(body.vijay, 60), akash: clean(body.akash, 60) };
  if (body.commission != null) set.commission = Math.max(0, Math.round(Number(body.commission) || 0));
  if (body.holdDays != null) set.holdDays = Math.min(60, Math.max(0, Math.round(Number(body.holdDays) || 0)));
  if (body.minPayout != null) set.minPayout = Math.max(0, Math.round(Number(body.minPayout) || 0));
  await db.collection('site').updateOne({ _id: 'settings' }, { $set: set }, { upsert: true });
  return json({ ok: true });
}, { admin: true });

on('POST', '/admin/images', async ({ db, body }) => {
  const m = String(body.data || '').match(/^data:(image\/(webp|jpeg|png));base64,([A-Za-z0-9+/=]+)$/);
  if (!m) throw httpError(400, 'Please upload a JPG, PNG or WebP image');
  if (m[3].length > 700000) throw httpError(400, 'Image is too large (max ~500 KB after compression)');
  const id = newId('i_');
  await db.collection('images').insertOne({ _id: id, type: m[1], data: m[3], createdAt: now() });
  return json({ id }, 201);
}, { admin: true });

on('GET', '/admin/overview', async ({ db }) => {
  const [users, orders, payouts, kyc] = await Promise.all([
    db.collection('users').countDocuments({}),
    db.collection('orders').find({ status: 'paid' }).toArray(),
    db.collection('payouts').countDocuments({ status: 'pending' }),
    db.collection('kyc').countDocuments({ status: 'submitted' })
  ]);
  const sod = new Date(); sod.setHours(0, 0, 0, 0);
  const at = o => new Date(o.paidAt || o.createdAt);
  const series = Array.from({ length: 30 }, (_, i) => {
    const d0 = new Date(sod.getTime() - (29 - i) * DAY), d1 = new Date(d0.getTime() + DAY);
    const day = orders.filter(o => at(o) >= d0 && at(o) < d1);
    return { d: d0.toISOString(), v: day.reduce((a, o) => a + o.amount, 0), n: day.length };
  });
  const recent = orders.sort((a, b) => at(b) - at(a)).slice(0, 8);
  const ppl = await peopleById(db, recent.map(o => o.userId));
  const cs = await db.collection('commissions').find({ status: { $ne: 'cancelled' } }).toArray();
  const byAff = {}; cs.forEach(c => { byAff[c.affiliateId] = (byAff[c.affiliateId] || 0) + c.amount; });
  const topA = Object.entries(byAff).sort((a, b) => b[1] - a[1]).slice(0, 5);
  const appl = await peopleById(db, topA.map(t => t[0]));
  const byCourse = {}; orders.forEach(o => { byCourse[o.title] = (byCourse[o.title] || 0) + o.amount; });
  const m30 = new Date(sod.getTime() - 29 * DAY), p30 = new Date(m30.getTime() - 30 * DAY);
  const rev = (a, b) => orders.filter(o => at(o) >= a && at(o) < b).reduce((x, o) => x + o.amount, 0);
  const newStudents = await db.collection('users').countDocuments({ createdAt: { $gte: m30 } });
  return json({
    students: users, newStudents, sales: orders.length, revenue: orders.reduce((a, o) => a + o.amount, 0),
    today: orders.filter(o => at(o) >= sod).reduce((a, o) => a + o.amount, 0),
    rev30: rev(m30, new Date(Date.now() + DAY)), revPrev30: rev(p30, m30),
    commission: cs.reduce((a, c) => a + c.amount, 0),
    pendingPayouts: payouts, pendingKyc: kyc, series,
    recent: recent.map(o => ({ ...(ppl[o.userId] || person(null)), title: o.title, amount: o.amount, d: at(o) })),
    topAffiliates: topA.map(([id, v]) => ({ ...(appl[id] || person(null)), v })),
    byCourse: Object.entries(byCourse).sort((a, b) => b[1] - a[1]).map(([t, v]) => ({ t, v }))
  });
}, { admin: true });

on('GET', '/admin/orders', async ({ db }) => json({ orders: (await db.collection('orders').find({}).sort({ createdAt: -1 }).limit(300).toArray()).map(o => ({ id: o._id, d: o.createdAt, name: o.userName, email: o.userEmail, title: o.title, amount: o.amount, status: o.status, paymentId: o.paymentId || '' })) }), { admin: true });

on('GET', '/admin/students', async ({ db, url }) => {
  const q = clean(url.searchParams.get('q'), 80).toLowerCase();
  let list = await db.collection('users').find({}).sort({ createdAt: -1 }).limit(500).toArray();
  if (q) list = list.filter(u => (u.name + ' ' + u.email + ' ' + (u.phone || '')).toLowerCase().includes(q));
  const enr = await db.collection('enrollments').find({ userId: { $in: list.map(u => u._id) }, active: true }).toArray();
  return json({ students: list.slice(0, 200).map(u => ({ ...publicUser(u), courses: enr.filter(e => e.userId === u._id).map(e => e.slug) })) });
}, { admin: true });

on('POST', '/admin/enroll', async ({ db, body }) => {
  const u = await db.collection('users').findOne({ email: clean(body.email, 120).toLowerCase() });
  if (!u) throw httpError(404, 'No student with this email');
  const slug = clean(body.slug, 60), active = body.action !== 'remove';
  await db.collection('enrollments').updateOne({ _id: `${u._id}:${slug}` }, { $set: { userId: u._id, slug, active, orderId: 'manual', updatedAt: now() }, $setOnInsert: { createdAt: now() } }, { upsert: true });
  return json({ ok: true });
}, { admin: true });

on('GET', '/admin/payouts', async ({ db }) => {
  const ps = await db.collection('payouts').find({}).sort({ createdAt: -1 }).limit(300).toArray();
  const ks = await db.collection('kyc').find({ _id: { $in: ps.map(p => p.userId) } }).toArray();
  const k = Object.fromEntries(ks.map(x => [x._id, x]));
  return json({ payouts: ps.map(p => ({ id: p._id, d: p.createdAt, name: p.userName, amount: p.amount, method: p.method, status: p.status, upi: k[p.userId]?.upi || '', account: k[p.userId]?.account || '', ifsc: k[p.userId]?.ifsc || '' })) });
}, { admin: true });

on('POST', '/admin/payouts/:id', async ({ db, params, body }) => {
  const status = ['paid', 'rejected'].includes(body.status) ? body.status : null;
  if (!status) throw httpError(400, 'Bad status');
  await db.collection('payouts').updateOne({ _id: params.id, status: 'pending' }, { $set: { status, note: clean(body.note, 200), doneAt: now() } });
  return json({ ok: true });
}, { admin: true });

on('GET', '/admin/kyc', async ({ db }) => json({ kyc: (await db.collection('kyc').find({}).sort({ updatedAt: -1 }).limit(300).toArray()).map(k => ({ id: k._id, name: k.userName, pan: k.pan, upi: k.upi, account: k.account, ifsc: k.ifsc, status: k.status })) }), { admin: true });

on('POST', '/admin/kyc/:id', async ({ db, params, body }) => {
  const status = ['approved', 'rejected'].includes(body.status) ? body.status : null;
  if (!status) throw httpError(400, 'Bad status');
  await db.collection('kyc').updateOne({ _id: params.id }, { $set: { status, note: clean(body.note, 200) } });
  return json({ ok: true });
}, { admin: true });

/* generic lists — registered last so specific /admin/* routes win */
const FIELDS = {
  reviews: { name: 80, meta: 80, course: 120, result: 120, text: 1200, photo: 60 },
  jobs: { t: 120, co: 120, loc: 80, type: 40, pay: 80, cat: 60, apply: 400 },
  missions: { t: 120, target: 10, reward: 200, valid: 80, img: 60 },
  packages: { t: 80, tag: 80, price: 10, pay: 400, feat: 2000, hot: 5, ord: 5, img: 60, courses: 400 }
};
on('POST', '/admin/:col', async ({ db, params, body }) => {
  const f = FIELDS[params.col];
  if (!f) throw httpError(404, 'Unknown list');
  const doc = { _id: newId(params.col.slice(0, 2) + '_'), ts: Date.now() };
  for (const [k, max] of Object.entries(f)) {
    let v = body[k];
    if (Array.isArray(v)) v = v.map(x => clean(x, 200)).filter(Boolean);
    else if (typeof v === 'boolean' || typeof v === 'number') v = v;
    else v = clean(v, max);
    if (v !== '' && v != null) doc[k] = v;
  }
  if (params.col === 'packages') { doc.price = Number(doc.price) || null; doc.hot = doc.hot === true || doc.hot === 'Yes'; doc.ord = Number(doc.ord) || 99; if (typeof doc.feat === 'string') doc.feat = doc.feat.split('\n').map(x => x.trim()).filter(Boolean); }
  if (params.col === 'missions') doc.target = Number(doc.target) || 0;
  if ((doc.apply && !isHttps(doc.apply)) || (doc.pay && !isHttps(doc.pay))) throw httpError(400, 'Links must start with https://');
  await db.collection(params.col).insertOne(doc);
  return json({ ok: true, id: doc._id }, 201);
}, { admin: true });

on('DELETE', '/admin/:col/:id', async ({ db, params }) => {
  if (!FIELDS[params.col]) throw httpError(404, 'Unknown list');
  await db.collection(params.col).deleteOne({ _id: params.id });
  return json({ ok: true });
}, { admin: true });

