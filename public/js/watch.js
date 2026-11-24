/* Learnify — lecture player ("watch" page).
   Route: #watch-<course-slug>  or  #watch-<course-slug>/<lesson number>
   Layout: video on the left, the whole lesson series on the right (below on phones).
   Enrolled students and admins get every lesson; everyone else gets the free previews
   and a clear "enrol to unlock" on the rest. Videos never open full-screen by themselves. */
(function () {
  const L = window.LF; if (!L) return;
  const { esc, getC, thumbOf, priceTxt } = L;
  const root = () => document.getElementById('watchRoot');
  const pad = n => String(n).padStart(2, '0');
  const ICON = {
    play: '<svg viewBox="0 0 24 24" width="14" height="14"><path d="M8 5v14l11-7z" fill="currentColor"/></svg>',
    lock: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>',
    check: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>',
    back: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg>',
    live: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="6" width="13" height="12" rx="2"/><path d="M16 10l5-3v10l-5-3"/></svg>'
  };
  let state = null; // { slug, course, lessons, done:Set, enrolled, wm, cur }

  const dbReady = () => new Promise(res => { let ok = false; const t = setTimeout(() => { if (!ok) res() }, 4000); L.onDb(() => { ok = true; clearTimeout(t); res() }) });
  async function load(slug) {
    await dbReady();
    const c = getC(slug);
    if (!c) return null;
    let course = c, done = [], enrolled = false, wm = '';
    const api = window.LFAPI;
    if (api) {
      await api.ready;
      if (api.me()) {
        try {
          const d = await api.j('/learn/' + encodeURIComponent(slug));
          course = Object.assign({}, c, d.course, { t: d.course.t || c.t });
          done = d.done || []; enrolled = true; wm = d.watermark || '';
        } catch (e) { /* not enrolled: fall back to the public lesson list */ }
      }
    } else if (L.S && L.S.admin) enrolled = true;
    const lessons = (course.modules || []).map((m, i) => {
      const playable = !!m.drive || !!m.video;
      const open = enrolled || m.free;
      return Object.assign({}, m, { i, open, playable: open && playable });
    });
    return { slug, course, lessons, done: new Set(done), enrolled, wm };
  }

  function progressHTML() {
    const n = state.lessons.length, d = state.lessons.filter(l => state.done.has(l.i)).length;
    const pct = n ? Math.round(d / n * 100) : 0;
    return { n, d, pct };
  }

  function playerHTML(l) {
    const c = state.course;
    if (!l) return `<div class="wpl wempty"><div>${ICON.live}<b>Lessons are on the way</b><p>Live classes run daily on Zoom. Recordings will appear here.</p></div></div>`;
    if (!l.open) {
      const th = thumbOf(c);
      return `<div class="wpl wlock">${th ? `<img src="${esc(th)}" alt="">` : ''}<div class="wlk"><span class="wlki">${ICON.lock}</span><b>This lesson is part of the full course</b><p>Enrol once to unlock every lesson, recording and live class.</p>${c.status === 'live' && window.LFAPI ? `<button type="button" class="btn btn-main" data-buy="course:${esc(state.slug)}">Unlock course · ${priceTxt(c.price)}</button>` : `<a class="btn btn-main" href="#course-${esc(state.slug)}">See course details</a>`}</div></div>`;
    }
    if (l.drive) return `<div class="wpl" oncontextmenu="return false"><iframe src="https://drive.google.com/file/d/${encodeURIComponent(l.drive)}/preview" title="${esc(l.t)}" allow="autoplay; fullscreen" allowfullscreen loading="lazy"></iframe><span class="dvblock" aria-hidden="true"></span>${state.wm ? `<span class="wm" aria-hidden="true">${esc(state.wm)}</span>` : ''}</div>`;
    if (l.video) return `<div class="wpl"><video src="${esc(L.blob(l.video))}" controls playsinline controlslist="nodownload" oncontextmenu="return false"></video></div>`;
    return `<div class="wpl wempty"><div>${ICON.live}<b>Taught live on Zoom</b><p>The recording of this class will appear here after the session.</p></div></div>`;
  }

  function itemHTML(l) {
    const cur = state.cur === l.i, isDone = state.done.has(l.i);
    const mark = cur && l.playable ? '<span class="weq" aria-hidden="true"><i></i><i></i><i></i></span>'
      : isDone ? `<span class="wck">${ICON.check}</span>` : !l.open ? `<span class="wlck">${ICON.lock}</span>` : `<span class="wno">${pad(l.i + 1)}</span>`;
    const tag = !state.enrolled && l.free ? '<em class="wfree">Free preview</em>' : !l.open ? '<em>Locked</em>' : isDone ? '<em class="wdone">Completed</em>' : l.playable ? '<em>Video</em>' : '<em>Live class</em>';
    return `<li style="--i:${l.i}"><a href="#watch-${esc(state.slug)}/${l.i + 1}" class="${cur ? 'on' : ''}${!l.open ? ' lk' : ''}" ${cur ? 'aria-current="true"' : ''}>${mark}<span class="wtx"><b>${esc(l.t)}</b>${tag}</span></a></li>`;
  }

  function render() {
    const c = state.course, ls = state.lessons, l = ls.find(x => x.i === state.cur) || null;
    const p = progressHTML();
    const prev = l && ls[l.i - 1], next = l && ls[l.i + 1];
    root().innerHTML = `
    <div class="wtop"><div class="wbox wtopi">
      <a class="wbk" href="#course-${esc(state.slug)}">${ICON.back}<span>Course page</span></a>
      <div class="wtt"><small>${esc(c.cat || 'Course')}</small><b>${esc(c.t)}</b></div>
      ${state.enrolled ? `<div class="wpr" title="${p.d} of ${p.n} lessons completed"><span>${p.pct}%</span><i><b style="width:${p.pct}%"></b></i></div>` : (c.status === 'live' && window.LFAPI ? `<button type="button" class="btn btn-main wcta" data-buy="course:${esc(state.slug)}">Enroll · ${priceTxt(c.price)}</button>` : '')}
    </div></div>
    <div class="wbox wgrid">
      <div class="wmain">
        <div class="wstage" id="wStage">${playerHTML(l)}</div>
        ${l ? `<div class="winfo">
          <div class="wmeta"><span class="wchip">Lesson ${pad(l.i + 1)} of ${pad(ls.length)}</span>${l.free && !state.enrolled ? '<span class="wchip wfree">Free preview</span>' : ''}${state.done.has(l.i) ? '<span class="wchip wdone">Completed</span>' : ''}</div>
          <h1>${esc(l.t)}</h1>
          ${l.d ? `<p class="wdesc">${esc(l.d)}</p>` : ''}
          <div class="wact">
            <a class="btn pill pill-o ${prev ? '' : 'dis'}" ${prev ? `href="#watch-${esc(state.slug)}/${prev.i + 1}"` : 'aria-disabled="true"'}>← Previous</a>
            ${state.enrolled ? `<button type="button" class="btn btn-alt" id="wDone" ${state.done.has(l.i) ? 'disabled' : ''}>${state.done.has(l.i) ? 'Completed ✓' : 'Mark as complete'}</button>` : ''}
            <a class="btn btn-main ${next ? '' : 'dis'}" ${next ? `href="#watch-${esc(state.slug)}/${next.i + 1}" data-next="1"` : 'aria-disabled="true"'}>Next lesson →</a>
          </div>
          ${next ? `<a class="wnext" href="#watch-${esc(state.slug)}/${next.i + 1}" data-next="1"><small>Up next</small><b>${pad(next.i + 1)} · ${esc(next.t)}</b>${!next.open ? `<span class="wlck">${ICON.lock}</span>` : `<span class="wpn">${ICON.play}</span>`}</a>` : ''}
        </div>` : ''}
      </div>
      <aside class="wside">
        <div class="wsh"><b>Course content</b><small>${p.n} lessons${state.enrolled ? ` · ${p.d} completed` : ''}</small>${state.enrolled ? `<i class="wbar"><b style="width:${p.pct}%"></b></i>` : ''}</div>
        ${ls.length ? `<ol class="wlist">${ls.map(itemHTML).join('')}</ol>` : '<p class="wnone">The full lesson list will appear here at launch.</p>'}
        ${!state.enrolled && c.status === 'live' && window.LFAPI ? `<div class="wunl"><b>Unlock all ${ls.length || ''} lessons</b><small>One payment · lifetime access · daily live classes</small><button type="button" class="btn btn-main" data-buy="course:${esc(state.slug)}">Enroll · ${priceTxt(c.price)}</button></div>` : ''}
      </aside>
    </div>`;
    const on = root().querySelector('.wlist a.on'), list = root().querySelector('.wlist');
    if (on && list && list.scrollHeight > list.clientHeight) list.scrollTop = Math.max(0, on.offsetTop - list.clientHeight / 2 + on.offsetHeight / 2); // keep the page itself still
    const b = document.getElementById('wDone');
    if (b) b.addEventListener('click', () => markDone(state.cur, true));
    root().querySelectorAll('[data-next]').forEach(a => a.addEventListener('click', () => { if (state.enrolled && l && l.playable) markDone(l.i, false) }));
  }

  async function markDone(i, rerender) {
    if (!state || !state.enrolled || state.done.has(i) || !window.LFAPI) return;
    state.done.add(i);
    if (rerender) render();
    try { const r = await window.LFAPI.j('/progress', { method: 'POST', body: JSON.stringify({ slug: state.slug, lesson: i }) }); (r.done || []).forEach(x => state.done.add(x)); }
    catch (e) { state.done.delete(i); if (rerender) render(); }
  }

  async function show(slug, n) {
    const r = root(); if (!r) return;
    const nav = document.querySelector('nav'); if (nav) document.documentElement.style.setProperty('--navh', nav.offsetHeight + 'px');
    const nowOwned = window.LFAPI && window.LFAPI.me() && (window.LFAPI.enrolled() || []).includes(slug);
    if (!state || state.slug !== slug || (nowOwned && !state.enrolled)) {
      r.innerHTML = '<div class="wbox wload"><span class="wspin"></span></div>';
      state = await load(slug);
      if (!state) { r.innerHTML = `<div class="wbox wnf"><h1>Course not found</h1><a class="btn btn-main" href="#courses">See all courses</a></div>`; return }
    }
    const ls = state.lessons;
    let cur = n ? n - 1 : -1;
    if (cur < 0 || cur >= ls.length) {
      const firstOpen = ls.find(l => l.open && !state.done.has(l.i)) || ls.find(l => l.open) || ls[0];
      cur = firstOpen ? firstOpen.i : -1;
    }
    state.cur = cur;
    render();
    const st = document.getElementById('wStage'); if (st) { st.classList.remove('swap'); void st.offsetWidth; st.classList.add('swap'); }
  }

  window.LFWatch = { show, reset() { state = null } };
  if (/^#watch-/.test(location.hash)) L.route(); // page opened straight on a lesson link
})();
