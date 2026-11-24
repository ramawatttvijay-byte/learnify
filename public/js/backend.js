/* Learnify backend bridge: connects the site to /api (Netlify Functions + MongoDB).
   It offers the small `claude.use()` interface the page was written against, so the
   same admin and data code works on the live site. Loaded in <head>, before the page script. */
(function () {
  if (window.claude) return;
  const API = '/api';
  async function j(path, opt = {}) {
    const r = await fetch(API + path, { credentials: 'same-origin', ...opt, headers: { 'content-type': 'application/json', ...(opt.headers || {}) } });
    const d = await r.json().catch(() => ({}));
    if (!r.ok) { const e = new Error(d.error || 'Something went wrong. Please try again.'); e.status = r.status; e.code = 'invalid_argument'; e.data = d; throw e; }
    return d;
  }
  // remember who referred this visitor (?ref=CODE)
  try { const ref = new URLSearchParams(location.search).get('ref'); if (ref) localStorage.setItem('lf_ref', ref.toUpperCase()); } catch (e) {}

  let me = null, enrolled = [], pub = null, isReady = false;
  const listeners = new Set();
  const EMPTY = { courses: [], settings: {}, reviews: [], jobs: [], missions: [], packages: [] };
  async function refresh() {
    try { pub = await j('/public' + (me && me.role === 'admin' ? '?admin=1' : '')); } catch (e) { pub = pub || EMPTY; }
    listeners.forEach(f => { try { f(); } catch (e) { console.error(e); } });
  }
  async function loadMe() { try { const d = await j('/me'); me = d.user; enrolled = d.enrolled || []; } catch (e) { me = null; enrolled = []; } }
  const ready = (async () => { await loadMe(); await refresh(); isReady = true; })();

  const snap = list => ({ docs: list.map(d => ({ id: d.id, exists: true, data: () => d })), size: list.length, empty: !list.length, metadata: { fromCache: false, hasPendingWrites: false } });
  const colData = name => !pub ? [] : name === 'courses' ? pub.courses.map(c => ({ ...c, id: c.s })) : (pub[name] || []);
  function docRef(path) {
    const [col, id] = path.split('/');
    return {
      id, path,
      onSnapshot(next) {
        const f = () => next(col === 'site' ? { id, exists: !!pub, data: () => (pub ? pub.settings : {}) } : (() => { const d = colData(col).find(x => x.id === id); return { id, exists: !!d, data: () => d }; })());
        listeners.add(f); ready.then(f); return () => listeners.delete(f);
      },
      async get() { await ready; const d = col === 'site' ? pub.settings : colData(col).find(x => x.id === id); return { id, exists: !!d, data: () => d }; },
      async set(body) {
        if (col === 'courses') await j('/admin/courses/' + encodeURIComponent(id), { method: 'PUT', body: JSON.stringify(body) });
        else if (col === 'site') await j('/admin/settings', { method: 'PUT', body: JSON.stringify(body) });
        else throw new Error('Not supported');
        await refresh();
      },
      async delete() {
        await j((col === 'courses' ? '/admin/courses/' : `/admin/${col}/`) + encodeURIComponent(id), { method: 'DELETE' });
        await refresh();
      }
    };
  }
  function colRef(name) {
    const self = {
      path: name, orderBy() { return self; }, limit() { return self; }, where() { return self; },
      onSnapshot(next) { const f = () => next(snap(colData(name))); listeners.add(f); ready.then(f); return () => listeners.delete(f); },
      async get() { await ready; return snap(colData(name)); },
      async add(d) { const r = await j('/admin/' + name, { method: 'POST', body: JSON.stringify(d) }); await refresh(); return docRef(name + '/' + r.id); },
      doc(id) { return docRef(name + '/' + id); }
    };
    return self;
  }
  const db = { collection: colRef, doc: docRef };
  const user = {
    async canEdit() { await ready; return !!(me && me.role === 'admin'); },
    async isOwner() { await ready; return !!(me && me.role === 'admin'); },
    async can() { await ready; return !!(me && me.role === 'admin'); },
    async id() { await ready; return me ? me.id : null; },
    async me() { await ready; return me; }
  };
  function shrink(file) {
    return new Promise((res, rej) => {
      const img = new Image(), url = URL.createObjectURL(file);
      img.onload = () => {
        const max = 1400, k = Math.min(1, max / Math.max(img.width, img.height));
        const c = document.createElement('canvas'); c.width = Math.round(img.width * k); c.height = Math.round(img.height * k);
        c.getContext('2d').drawImage(img, 0, 0, c.width, c.height); URL.revokeObjectURL(url);
        let q = 0.85, out = c.toDataURL('image/webp', q);
        while (out.length > 650000 && q > 0.4) { q -= 0.1; out = c.toDataURL('image/webp', q); }
        res(out);
      };
      img.onerror = () => rej(new Error('Could not read this image'));
      img.src = url;
    });
  }
  const assets = {
    async upload(file) {
      if (!/^image\//.test(file.type)) throw new Error('Videos go on Google Drive. Paste the Drive link in the lesson instead.');
      const data = await shrink(file);
      const r = await j('/admin/images', { method: 'POST', body: JSON.stringify({ data }) });
      return { id: r.id, url: '/api/img/' + r.id };
    }
  };
  window.claude = { use: async name => { await ready; return name === 'db' ? db : name === 'user' ? (me ? user : user) : name === 'assets' ? (me && me.role === 'admin' ? assets : null) : null; } };

  /* ---------- payments ---------- */
  let rzpLoad = null;
  function loadRzp() {
    if (window.Razorpay) return Promise.resolve();
    return rzpLoad ||= new Promise((res, rej) => { const s = document.createElement('script'); s.src = 'https://checkout.razorpay.com/v1/checkout.js'; s.onload = res; s.onerror = () => { rzpLoad = null; rej(new Error('Could not load Razorpay')); }; document.head.appendChild(s); });
  }
  function toast(msg, ok) {
    let t = document.getElementById('lfToast');
    if (!t) { t = document.createElement('div'); t.id = 'lfToast'; t.setAttribute('role', 'status'); document.body.appendChild(t); }
    t.textContent = msg; t.className = ok ? 'ok' : 'bad'; t.classList.add('on');
    clearTimeout(t._h); t._h = setTimeout(() => t.classList.remove('on'), 4200);
  }
  async function buy(kind, id) {
    await ready;
    if (!me) { try { sessionStorage.setItem('lf_after', `buy:${kind}:${id}`); } catch (e) {} toast('Please log in or create an account to enrol.'); location.hash = '#login'; return; }
    try {
      const [o] = await Promise.all([j('/pay/order', { method: 'POST', body: JSON.stringify({ kind, id }) }), loadRzp()]);
      const rz = new window.Razorpay({
        key: o.keyId, order_id: o.rpOrderId, amount: o.amount, currency: 'INR', name: 'Learnify', description: o.title,
        prefill: { name: o.name, email: o.email, contact: o.phone }, theme: { color: '#5b1ff3' },
        handler: async resp => {
          try {
            const v = await j('/pay/verify', { method: 'POST', body: JSON.stringify(resp) });
            await loadMe(); await refresh(); toast('Payment successful. Your course is unlocked!', true);
            location.hash = '#watch-' + (v.slugs[0] || '');
          } catch (e) { toast('Payment received. If the course is not unlocked in a minute, contact us.'); }
        }
      });
      rz.on('payment.failed', () => toast('Payment failed. No money was taken; please try again.'));
      rz.open();
    } catch (e) { toast(e.message); }
  }
  document.addEventListener('click', e => { const b = e.target.closest('[data-buy]'); if (!b) return; e.preventDefault(); const [kind, ...rest] = b.dataset.buy.split(':'); buy(kind, rest.join(':')); });

  window.LFAPI = {
    j, ready, refresh, toast, buy,
    get isReady() { return isReady; },
    me: () => me, enrolled: () => enrolled.slice(),
    async reloadMe() { await loadMe(); return me; },
    async login(email, password) { const d = await j('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }); me = d.user; await loadMe(); await refresh(); return me; },
    async signup(f) { let ref = ''; try { ref = localStorage.getItem('lf_ref') || ''; } catch (e) {} const d = await j('/auth/signup', { method: 'POST', body: JSON.stringify({ ...f, ref }) }); me = d.user; await loadMe(); await refresh(); return me; },
    async logout() { try { await j('/auth/logout', { method: 'POST', body: '{}' }); } catch (e) {} me = null; enrolled = []; await refresh(); },
    resumeAfterLogin() { let a = null; try { a = sessionStorage.getItem('lf_after'); sessionStorage.removeItem('lf_after'); } catch (e) {} if (a && a.startsWith('buy:')) { const [, kind, ...id] = a.split(':'); setTimeout(() => buy(kind, id.join(':')), 300); return true; } return false; }
  };
})();
