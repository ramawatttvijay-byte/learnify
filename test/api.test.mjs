import test from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import { memDb } from './memdb.mjs';

process.env.JWT_SECRET = 'test-secret-test-secret-test-secret-123';
process.env.ADMIN_EMAILS = 'boss@learnify.in';
process.env.RAZORPAY_KEY_ID = 'rzp_test_key';
process.env.RAZORPAY_KEY_SECRET = 'rzp_secret';
process.env.RAZORPAY_WEBHOOK_SECRET = 'wh_secret';
globalThis.__lfTestDb = memDb();
const db = globalThis.__lfTestDb;

let rpCount = 0;
const realFetch = globalThis.fetch;
globalThis.fetch = async (url, opt) => {
  if (String(url).startsWith('https://api.razorpay.com/v1/orders')) {
    assert.match(opt.headers.authorization, /^Basic /);
    const b = JSON.parse(opt.body);
    return new Response(JSON.stringify({ id: 'order_RP' + (++rpCount), amount: b.amount }), { status: 200 });
  }
  return realFetch(url, opt);
};
const { default: api } = await import('../netlify/functions/api.mjs');

async function call(method, path, body, cookie, headers = {}) {
  const init = { method, headers: { ...headers } };
  if (cookie) init.headers.cookie = cookie;
  if (body !== undefined) init.body = typeof body === 'string' ? body : JSON.stringify(body);
  const res = await api(new Request('https://learnify.in/api' + path, init));
  const sc = res.headers.get('set-cookie');
  const data = res.headers.get('content-type')?.includes('json') ? await res.json() : await res.text();
  return { status: res.status, data, cookie: sc ? sc.split(';')[0] : null };
}

let admin, alice, bob, aliceCode;
test('signup, admin role, login, one device', async () => {
  const a = await call('POST', '/auth/signup', { name: 'Boss', email: 'boss@learnify.in', password: 'password123' });
  assert.equal(a.status, 201); assert.equal(a.data.user.role, 'admin'); admin = a.cookie;
  const s = await call('POST', '/auth/signup', { name: 'Alice', email: 'alice@x.com', password: 'password123', phone: '9876543210' });
  assert.equal(s.data.user.role, 'student'); alice = s.cookie; aliceCode = s.data.user.code;
  assert.equal((await call('POST', '/auth/signup', { name: 'Alice2', email: 'alice@x.com', password: 'password123' })).status, 409);
  const b = await call('POST', '/auth/signup', { name: 'Bob', email: 'bob@x.com', password: 'password123', ref: aliceCode });
  bob = b.cookie;
  assert.equal((await call('POST', '/auth/login', { email: 'bob@x.com', password: 'nope' })).status, 401);
  const b2 = await call('POST', '/auth/login', { email: 'bob@x.com', password: 'password123' });
  assert.equal(b2.status, 200);
  assert.equal((await call('GET', '/me', undefined, bob)).data.user, null, 'old device signed out');
  bob = b2.cookie;
  assert.equal((await call('GET', '/me', undefined, bob)).data.user.name, 'Bob');
});

test('admin saves course; public hides locked drive ids', async () => {
  assert.equal((await call('PUT', '/admin/courses/meta-ads', { t: 'Meta Ads', price: 2499, status: 'live', modules: [] }, alice)).status, 403);
  const r = await call('PUT', '/admin/courses/meta-ads', { t: 'Meta Ads Mastery Course', price: 2499, status: 'live', modules: [
    { t: 'Intro', url: 'https://drive.google.com/file/d/1AbCdEfGhIjKlMnOpQrStUvWxYz012345/view?usp=sharing', free: true },
    { t: 'Ads Manager', url: 'https://drive.google.com/file/d/1ZzYyXxWwVvUuTtSsRrQqPpOoNnMm9876/view' }
  ] }, admin);
  assert.equal(r.status, 200);
  const p = await call('GET', '/public');
  const c = p.data.courses.find(x => x.s === 'meta-ads');
  assert.equal(c.modules[0].drive, '1AbCdEfGhIjKlMnOpQrStUvWxYz012345');
  assert.equal(c.modules[1].drive, undefined); assert.equal(c.modules[1].locked, true);
  const full = await call('GET', '/public?admin=1', undefined, admin);
  assert.equal(full.data.courses[0].modules[1].drive, '1ZzYyXxWwVvUuTtSsRrQqPpOoNnMm9876');
});

test('learn is locked until payment; Razorpay verify unlocks and pays referrer', async () => {
  assert.equal((await call('GET', '/learn/meta-ads')).status, 401);
  assert.equal((await call('GET', '/learn/meta-ads', undefined, bob)).status, 403);
  assert.equal((await call('POST', '/pay/order', { kind: 'course', id: 'content-creation' }, bob)).status, 400, 'soon course not buyable');
  const o = await call('POST', '/pay/order', { kind: 'course', id: 'meta-ads' }, bob);
  assert.equal(o.status, 200); assert.equal(o.data.amount, 249900);
  const bad = await call('POST', '/pay/verify', { razorpay_order_id: o.data.rpOrderId, razorpay_payment_id: 'pay_1', razorpay_signature: 'x' }, bob);
  assert.equal(bad.status, 400);
  const sig = crypto.createHmac('sha256', 'rzp_secret').update(`${o.data.rpOrderId}|pay_1`).digest('hex');
  const ok = await call('POST', '/pay/verify', { razorpay_order_id: o.data.rpOrderId, razorpay_payment_id: 'pay_1', razorpay_signature: sig }, bob);
  assert.equal(ok.status, 200);
  const l = await call('GET', '/learn/meta-ads', undefined, bob);
  assert.equal(l.status, 200); assert.equal(l.data.course.modules[1].drive, '1ZzYyXxWwVvUuTtSsRrQqPpOoNnMm9876');
  // webhook arrives too: must not double count
  const raw = JSON.stringify({ event: 'payment.captured', payload: { payment: { entity: { id: 'pay_1', order_id: o.data.rpOrderId } } } });
  const wsig = crypto.createHmac('sha256', 'wh_secret').update(raw).digest('hex');
  assert.equal((await call('POST', '/pay/webhook', raw, null, { 'x-razorpay-signature': 'bad' })).status, 400);
  assert.equal((await call('POST', '/pay/webhook', raw, null, { 'x-razorpay-signature': wsig })).status, 200);
  assert.equal(await db.collection('commissions').countDocuments({}), 1);
  assert.equal((await call('POST', '/pay/order', { kind: 'course', id: 'meta-ads' }, bob)).status, 409, 'already owned');
  const aff = await call('GET', '/affiliate', undefined, alice);
  assert.equal(aff.data.all, 625); assert.equal(aff.data.pending, 625); assert.equal(aff.data.balance, 0);
  assert.equal(aff.data.referrals.length, 1);
  const lb = await call('GET', '/leaderboard?range=7d', undefined, alice);
  assert.equal(lb.data.top.length, 1); assert.equal(lb.data.top[0].n, 'Alice'); assert.equal(lb.data.top[0].v, 625); assert.equal(lb.data.top[0].me, true); assert.equal(lb.data.top[0].em, 'al•••e@x.com'); assert.ok(!JSON.stringify(lb.data).includes('alice@x.com')); assert.equal(lb.data.myRank, 1);
  const pr = await call('POST', '/progress', { slug: 'meta-ads', lesson: 1 }, bob);
  assert.deepEqual(pr.data.done, [1]);
});

test('payouts need KYC and an approved balance', async () => {
  assert.equal((await call('POST', '/payouts', { amount: 600 }, alice)).status, 400);
  assert.equal((await call('POST', '/kyc', { pan: 'BAD', upi: 'a@upi' }, alice)).status, 400);
  assert.equal((await call('POST', '/kyc', { name: 'Alice', pan: 'ABCDE1234F', upi: 'alice@upi' }, alice)).status, 200);
  const k = await call('GET', '/admin/kyc', undefined, admin);
  const uid = k.data.kyc[0].id;
  await call('POST', '/admin/kyc/' + uid, { status: 'approved' }, admin);
  assert.match((await call('POST', '/payouts', { amount: 600 }, alice)).data.error, /more than your available/);
  const c = [...db._cols.commissions.docs.values()][0]; c.releaseAt = new Date(Date.now() - 1000);
  assert.equal((await call('POST', '/payouts', { amount: 400 }, alice)).status, 400, 'below minimum');
  assert.equal((await call('POST', '/payouts', { amount: 600 }, alice)).status, 200);
  assert.equal((await call('GET', '/affiliate', undefined, alice)).data.balance, 25);
  const ps = await call('GET', '/admin/payouts', undefined, admin);
  assert.equal(ps.data.payouts[0].upi, 'alice@upi');
  await call('POST', '/admin/payouts/' + ps.data.payouts[0].id, { status: 'paid' }, admin);
});

test('refund webhook removes access and cancels commission', async () => {
  const raw = JSON.stringify({ event: 'refund.processed', payload: { refund: { entity: { payment_id: 'pay_1' } } } });
  const wsig = crypto.createHmac('sha256', 'wh_secret').update(raw).digest('hex');
  assert.equal((await call('POST', '/pay/webhook', raw, null, { 'x-razorpay-signature': wsig })).status, 200);
  assert.equal((await call('GET', '/learn/meta-ads', undefined, bob)).status, 403);
  assert.equal([...db._cols.commissions.docs.values()][0].status, 'cancelled');
});

test('admin lists, settings, images, manual enroll', async () => {
  assert.equal((await call('POST', '/admin/reviews', { name: 'Riya', text: 'Great class', course: 'Meta Ads' }, admin)).status, 201);
  assert.equal((await call('POST', '/admin/jobs', { t: 'Ads Exec', co: 'Acme', apply: 'http://x' }, admin)).status, 400);
  assert.equal((await call('POST', '/admin/packages', { t: 'Complete', price: '4999', feat: 'All skills\nLive', hot: 'Yes', courses: 'all' }, admin)).status, 201);
  const pub = await call('GET', '/public');
  assert.equal(pub.data.reviews[0].name, 'Riya'); assert.equal(pub.data.packages[0].price, 4999); assert.deepEqual(pub.data.packages[0].feat, ['All skills', 'Live']);
  assert.equal((await call('PUT', '/admin/settings', { wa: '98765 43210', commission: 700, social: { instagram: 'https://instagram.com/learnify', x: 'javascript:alert(1)' } }, admin)).status, 200);
  const pub2 = await call('GET', '/public');
  assert.equal(pub2.data.settings.wa, '9876543210'); assert.equal(pub2.data.settings.social.x, undefined); assert.equal(pub2.data.settings.commission, undefined);
  const img = await call('POST', '/admin/images', { data: 'data:image/webp;base64,UklGRg==' }, admin);
  assert.equal(img.status, 201);
  const got = await api(new Request('https://learnify.in/api/img/' + img.data.id));
  assert.equal(got.headers.get('content-type'), 'image/webp');
  assert.equal((await call('POST', '/admin/enroll', { email: 'alice@x.com', slug: 'meta-ads' }, admin)).status, 200);
  assert.equal((await call('GET', '/learn/meta-ads', undefined, alice)).status, 200);
  const st = await call('GET', '/admin/students?q=ali', undefined, admin);
  assert.deepEqual(st.data.students[0].courses, ['meta-ads']);
  const pkgId = pub.data.packages[0].id;
  const o = await call('POST', '/pay/order', { kind: 'package', id: pkgId }, bob);
  assert.equal(o.data.amount, 499900);
  assert.equal((await call('GET', '/nope')).status, 404);
});

test('profile photo upload and masked emails', async () => {
  const s = await call('POST', '/auth/signup', { name: 'Photo User', email: 'photo.user@gmail.com', password: 'password123' });
  const bad = await call('POST', '/me/avatar', { data: 'data:text/html;base64,PGgxPg==' }, s.cookie);
  assert.equal(bad.status, 400);
  const ok = await call('POST', '/me/avatar', { data: 'data:image/webp;base64,UklGRhoAAABXRUJQVlA4TA0AAAAvAAAAEAcQERGIiP4HAA==' }, s.cookie);
  assert.equal(ok.status, 200); assert.match(ok.data.avatar, /^a_/);
  const me = await call('GET', '/me', undefined, s.cookie);
  assert.equal(me.data.user.avatar, ok.data.avatar);
  const img = await call('GET', '/img/' + ok.data.avatar);
  assert.equal(img.status, 200);
  const del = await call('DELETE', '/me/avatar', undefined, s.cookie);
  assert.equal(del.status, 200);
  assert.equal((await call('GET', '/img/' + ok.data.avatar)).status, 404);
});
