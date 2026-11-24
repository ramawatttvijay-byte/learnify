/* Learnify student panel + packages + jobs. Uses window.LF from the main script. */
{
const L=window.LF;if(!L)throw new Error('LF missing');
const {esc,blob,safeUrl,priceTxt,thumbOf}=L;
const I=p=>`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${p}</svg>`;
const IC={
 home:'<path d="M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>',
 book:'<path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z"/><path d="M4 19V5"/>',
 star:'<path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z"/>',
 quiz:'<circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .8-1 1.5V14M12 17.5v.01"/>',
 cert:'<circle cx="12" cy="9" r="5"/><path d="M8.5 13.5L7 21l5-3 5 3-1.5-7.5"/>',
 link:'<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>',
 tool:'<path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.5 2.5-2.5-.5-.5-2.5z"/>',
 play:'<rect x="3" y="4" width="18" height="14" rx="2"/><path d="M10 8l5 3-5 3z"/>',
 pay:'<rect x="2" y="6" width="20" height="13" rx="2"/><path d="M2 10h20M6 15h4"/>',
 wal:'<path d="M20 7H5a2 2 0 0 1 0-4h13v4"/><path d="M3 5v14a2 2 0 0 0 2 2h15V7"/><circle cx="16" cy="14" r="1.5"/>',
 trophy:'<path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0z"/><path d="M17 5h3v2a3 3 0 0 1-3 3M7 5H4v2a3 3 0 0 0 3 3"/>',
 team:'<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0"/><path d="M16 4.5a3.5 3.5 0 0 1 0 7M18 14a6 6 0 0 1 3.5 6"/>',
 user:'<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
 flag:'<path d="M5 21V4M5 4h11l-2 4 2 4H5"/>',
 gift:'<rect x="3" y="8" width="18" height="13" rx="2"/><path d="M12 8v13M3 12h18M12 8a3 3 0 1 1-3-3c2 0 3 3 3 3zm0 0a3 3 0 1 0 3-3c-2 0-3 3-3 3z"/>',
 id:'<rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="9" cy="11" r="2.5"/><path d="M5.5 16a3.5 3.5 0 0 1 7 0M15 10h3M15 13h3"/>',
 chat:'<path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1.1-4.6A8 8 0 1 1 21 12z"/>',
 globe:'<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>',
 up:'<path d="M12 19V5M5 12l7-7 7 7"/>',
 bell:'<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10 21a2 2 0 0 0 4 0"/>',
 lock:'<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',
 out:'<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>',
 menu:'<path d="M4 7h16M4 12h16M4 17h16"/>',
 brief:'<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"/>'
};
const MODS=[
 ['','dashboard','Dashboard','home'],
 ['Learn','dash-courses','My Courses','book'],['Learn','dash-training','Training','star'],['Learn','dash-quiz','Quiz','quiz'],['Learn','dash-certificates','Certificates','cert'],
 ['Earn','dash-affiliate','Affiliate Links','link'],['Earn','dash-tools','Marketing Tools','tool'],['Earn','dash-payouts','Payouts & Wallet','pay'],
 ['Grow','dash-leaderboard','Leaderboard','trophy'],['Grow','dash-team','My Team','team'],['Grow','dash-milestones','Milestones & Rewards','flag'],
 ['Account','dash-profile','Profile & Security','user'],['Account','dash-kyc','KYC','id'],['Account','dash-help','Help & Community','chat'],['Account','dash-upgrade','Upgrade','up']
];
const ALIAS={wallet:'payouts',associates:'team',missions:'milestones',security:'profile',mentor:'help',community:'help',atraining:'training'};
/* ---------- sample data (preview only) ---------- */
const NAMES=['Rohit Sharma','Priya Verma','Aman Khan','Sneha Gupta','Mohit Singh','Kavya Jain','Arjun Mehta','Pooja Yadav','Rahul Patel','Neha Joshi','Vikas Choudhary','Anjali Rawat','Sahil Bansal','Riya Kapoor','Deepak Meena'];
const COMM=625;
function rnd(seed){let s=seed%2147483647;if(s<=0)s+=2147483646;return()=>(s=s*16807%2147483647)/2147483647}
const r=rnd(42);
const today=new Date();
const dstr=d=>d.toLocaleDateString('en-IN',{day:'2-digit',month:'short'});
const dfull=d=>d.toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric'});
const ago=n=>{const d=new Date(today);d.setDate(d.getDate()-n);return d};
const courseNames=()=>L.visible().map(c=>c.t);
const SALES=Array.from({length:24},(_,i)=>({d:ago(Math.floor(i*1.6)),name:NAMES[i%NAMES.length],course:courseNames()[Math.floor(r()*courseNames().length)]||'Meta Ads Mastery Course',amt:COMM,st:i<3?'Pending':'Paid'}));
const WEEK=Array.from({length:7},(_,i)=>{const d=ago(6-i);const n=[2,1,3,1,2,3,2][i];return{l:d.toLocaleDateString('en-IN',{weekday:'short'}),v:n*COMM}});
const PAYOUTS=[[ago(3),5000,'UPI','Paid'],[ago(10),7500,'Bank transfer','Paid'],[ago(17),6250,'UPI','Paid'],[ago(24),3750,'UPI','Paid']];
const LB=NAMES.slice(0,12).map((n,i)=>({n,v:Math.round((180000-i*12500-r()*6000)/625)*625}));
const MILES=[{t:'Starter',amt:10000,rw:'Digital certificate'},{t:'Rising Star',amt:50000,rw:'Learnify T-shirt + shoutout'},{t:'1 Lakh Club',amt:100000,rw:'Celebration cake + achievement poster'},{t:'5 Lakh Club',amt:500000,rw:'Premium gadget'},{t:'10 Lakh Club',amt:1000000,rw:'Trip for two'}];
const ME={all:63530,today:1250,w:8750,m:32500,bal:4375,goal:40000,pkg:'Single',todayN:2,wN:14,mN:52,comm:625,minPayout:500};
const ini=n=>String(n||'?').split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase();
const inr=v=>'₹'+Number(v).toLocaleString('en-IN');
let SAMPLE='<p class="sample2">Preview with sample numbers. Real earnings, sales and payouts appear once student accounts and payments are connected.</p>';
const LIVE=!!window.LFAPI;let liveLoaded=false,REFS=[];
async function loadLive(){if(!LIVE||!L.getUser()){liveLoaded=true;return}
 try{const a=await LFAPI.j('/affiliate');SAMPLE='';
  const en=LFAPI.enrolled(),nAll=L.visible().length;
  Object.assign(ME,{all:a.all,today:a.today,w:a.d7,m:a.d30,bal:a.balance,todayN:a.todayN,wN:a.d7N,mN:a.d30N,allN:a.allN,pending:a.pending,comm:a.commission,minPayout:a.minPayout,code:a.code,
   goal:Math.max(10000,Math.ceil(((a.d30||0)*1.25)/5000)*5000),pkg:en.length&&en.length>=nAll?'Complete':en.length?'Student':'Free'});
  SALES.splice(0,SALES.length,...a.sales.map(x=>({d:new Date(x.d),name:x.name,course:x.course,amt:x.amt,st:x.st==='pending'?'Pending':x.st==='cancelled'?'Cancelled':x.st==='paid'?'Paid':'Approved'})));
  WEEK.splice(0,WEEK.length,...a.week.map(w=>({l:new Date(w.d).toLocaleDateString('en-IN',{weekday:'short'}),v:w.v})));
  PAYOUTS.splice(0,PAYOUTS.length,...a.payouts.map(p=>[new Date(p.d),p.amt,p.mode,p.st.charAt(0).toUpperCase()+p.st.slice(1)]));
  REFS=a.referrals||[];
 }catch(e){console.error(e)}finally{liveLoaded=true}}
function liveForm(fid,mid,fn){const f=document.getElementById(fid);if(!f)return;f.addEventListener('submit',async e=>{e.preventDefault();const x=document.getElementById(mid),b=f.querySelector('button[type=submit]');b.disabled=true;
 try{const t=await fn([...f.querySelectorAll('input,select,textarea')].map(i=>i.value.trim()));x.textContent=t;x.className='amsg ok'}catch(err){x.textContent=err.message;x.className='amsg err'}finally{b.disabled=false}})}
/* ---------- shell ---------- */
let current='dashboard';
function user(){return L.getUser()||{name:'Learner',email:''}}
function shell(){
  const u=user();let g='';
  const nav=MODS.map(([grp,id,label,ic])=>{const h=grp&&grp!==g?`<div class="sg">${grp}</div>`:'';g=grp;return h+`<a href="#${id}" data-m="${id}">${I(IC[ic])}<span>${label}</span></a>`}).join('');
  return `<div class="ap"><aside class="side2" id="side2" aria-label="Student menu"><div class="me2"><span class="av3">${esc(ini(u.name))}</span><span><b>${esc(u.name)}</b><small>${esc(u.email)}</small><br><span class="pk">${ME.pkg.toUpperCase()}</span></span></div>${nav}<a href="#login" class="lo2" id="lo2">${I(IC.out)}<span>Log out</span></a></aside><div class="scrim" id="scrim"></div><main class="mainp" id="mainp"></main></div>`;
}
function top(title,extra=''){return `<div class="ptop"><button class="sbtn" type="button" id="sbtn" aria-label="Open menu">${I(IC.menu)}</button><h1>${title}</h1><div class="sp">${extra}<a class="bell" href="#dash-notifications" aria-label="Notifications">${I(IC.bell)}<i></i></a></div></div>`}
function mount(){
  const root=document.getElementById('app');if(root.dataset.ready)return;root.innerHTML=shell();root.dataset.ready='1';
  document.getElementById('lo2').addEventListener('click',e=>{e.preventDefault();L.logout()});
  const sd=document.getElementById('side2'),sc=document.getElementById('scrim');
  sc.addEventListener('click',()=>{sd.classList.remove('open');sc.classList.remove('open')});
  sd.addEventListener('click',e=>{if(e.target.closest('a')){sd.classList.remove('open');sc.classList.remove('open')}});
}
function show(hash){
  mount();
  if(LIVE&&!liveLoaded){document.getElementById('mainp').innerHTML='<div class="empty2">Loading your dashboard…</div>';loadLive().then(()=>show(hash));return}
  current=hash||'dashboard';
  let mod=current==='dashboard'?'dashboard':current.replace(/^dash-/,''),arg='';
  if(ALIAS[mod]){mod=ALIAS[mod];current='dash-'+mod}
  if(current.startsWith('dash-learn-')){mod='learn';arg=current.slice(11)}
  document.querySelectorAll('#side2 [data-m]').forEach(a=>a.classList.toggle('on',a.dataset.m===current||(mod==='learn'&&a.dataset.m==='dash-courses')));
  const m=document.getElementById('mainp');
  const fn=VIEWS[mod]||VIEWS.dashboard;
  m.innerHTML=fn(arg);
  const sb=document.getElementById('sbtn');if(sb)sb.addEventListener('click',()=>{document.getElementById('side2').classList.add('open');document.getElementById('scrim').classList.add('open')});
  (AFTER[mod]||(()=>{}))(arg);
}
function rerender(){plansHome();if(L.curPage()==='dashboard')show(current);const p=L.curPage();if(p==='packages')renderPackages();if(p==='jobs')renderJobs()}
/* ---------- helpers ---------- */
function copyBtn(id,text){return `<button class="btn btn-main" type="button" data-copy="${esc(text)}" style="min-height:44px">Copy</button>`}
function wireCopy(){document.querySelectorAll('#mainp [data-copy]').forEach(b=>b.addEventListener('click',()=>{const t=b.dataset.copy;const done=()=>{b.textContent='Copied!';setTimeout(()=>b.textContent='Copy',1600)};try{navigator.clipboard.writeText(t).then(done,()=>{b.textContent='Select & copy'})}catch(e){b.textContent='Select & copy'}}))}
const refCode=()=>ME.code||user().name.toLowerCase().replace(/[^a-z0-9]/g,'').slice(0,12)||'learner';
const refUrl=(s)=>(LIVE?location.origin:'https://learnify.in')+'/?ref='+refCode()+(s?(String(s).startsWith('pkg-')?'#packages':'#course-'+s):'');
function table(head,rows,numCols=[]){return `<div class="tw"><table class="t2"><thead><tr>${head.map((h,i)=>`<th${numCols.includes(i)?' class="num"':''}>${h}</th>`).join('')}</tr></thead><tbody>${rows.map(r=>`<tr>${r.map((c,i)=>`<td${numCols.includes(i)?' class="num"':''}>${c}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`}
const stTag=s=>`<span class="tg2 ${s==='Paid'||s==='Active'||s==='Completed'||s==='Approved'?'ok':s==='Pending'?'pn':'pu'}">${s}</span>`;
function packages(){const db=L.S.pkgs||[];if(db.length)return db;
  const n=L.visible().length;return [
   {id:'single',t:'Single Skill',tag:'Pick any one skill',price:2499,feat:['Any one Learnify skill','Recorded lessons + daily live classes on Zoom','Homework and doubt support','Certificate on completion'],color:'linear-gradient(140deg,#4b1ff5,#7a5cff)'},
   {id:'complete',t:'Learnify Complete',tag:`All ${n} skills`,price:null,hot:true,feat:[`All ${n} skills, current and upcoming`,'Recorded lessons + daily live classes','Affiliate dashboard, links and marketing tools','Priority mentor support and community'],color:'linear-gradient(140deg,#4b1ff5,#a60eef 55%,#ff0a8c)'}]}
function plansHome(){const r=document.getElementById('plansHome');if(!r)return;r.innerHTML=packages().slice(0,3).map(p=>{const pay=safeUrl(p.pay),w=L.waLink('Hi Learnify, I want the '+p.t+' plan.'),href=pay||w||'#contact',ext=pay||w;const canBuy=LIVE&&p.price&&p.id&&!/^(single|complete)$/.test(p.id),isSingle=LIVE&&p.id==='single';
  return `<article class="plan${p.hot?' hot':''}">${p.hot?'<span class="ribbon">Best value</span>':''}<small>${esc(p.tag||'')}</small><h3>${esc(p.t)}</h3><div class="pz2">${p.price?inr(p.price):'Ask us'}<small>${p.price?'one-time':'price on WhatsApp'}</small></div><ul>${(p.feat||[]).map(f=>`<li>${esc(f)}</li>`).join('')}</ul>${canBuy?`<button type="button" class="btn ${p.hot?'btn-main':'btn-alt'}" data-buy="package:${esc(p.id)}">Get started</button>`:isSingle?`<a class="btn ${p.hot?'btn-main':'btn-alt'}" href="#home-courses">Choose a skill</a>`:`<a class="btn ${p.hot?'btn-main':'btn-alt'}" href="${esc(href)}"${ext?' target="_blank" rel="noopener"':''}>${p.price?'Get started':'Get details'}</a>`}</article>`}).join('')}
/* ---------- views ---------- */
const VIEWS={
 dashboard(){
  const mx=Math.max(1,...WEEK.map(w=>w.v));const pct=Math.min(100,Math.round(ME.all/100000*100));
  const cols=['#4b1ff5','#a60eef','#ff0a8c','#ffb400','#12a150'];let cn=courseNames().slice(0,5),sh=[38,24,16,12,10],tot=SALES.length*4;
  if(LIVE){const by={};SALES.forEach(x=>by[x.course]=(by[x.course]||0)+1);cn=Object.keys(by).slice(0,5);tot=SALES.length;sh=cn.map(k=>tot?by[k]/tot*100:0);if(!tot){cn=['No sales yet'];sh=[100]}}
  let acc=0;const cg=cn.map((c,i)=>{const s=acc;acc+=sh[i];return `${cols[i]} ${s}% ${acc}%`}).join(',');
  return top('Welcome back, '+esc(user().name.split(' ')[0]),`<a class="btn btn-main" href="#dash-affiliate" style="min-height:44px">Share &amp; earn</a>`)+SAMPLE+
  `<div class="g4"><div class="kpi k1"><span>Today</span><b>${inr(ME.today)}</b><small>${ME.todayN} sales</small></div><div class="kpi k2"><span>Last 7 days</span><b>${inr(ME.w)}</b><small>${ME.wN} sales</small></div><div class="kpi k3"><span>Last 30 days</span><b>${inr(ME.m)}</b><small>${ME.mN} sales</small></div><div class="kpi k4"><span>All time</span><b>${inr(ME.all)}</b><small>Since you joined</small></div></div>
  <div class="g2"><section class="cardp"><h2>Last 7 days commission<span class="mut">${inr(ME.w)}</span></h2><div class="bars">${WEEK.map(w=>`<div><em>${inr(w.v)}</em><i data-h="${Math.round(w.v/mx*150)}" style="height:0"></i><span>${w.l}</span></div>`).join('')}</div></section>
   <div style="display:flex;flex-direction:column;gap:16px"><section class="cardp"><h2>Your affiliate link</h2><div class="copyrow"><code>${esc(refUrl())}</code>${copyBtn('r',refUrl())}</div></section>
   <section class="cardp"><h2>Monthly goal<span class="mut">${inr(ME.m)} / ${inr(ME.goal)}</span></h2><div class="prog2"><i style="width:${Math.round(ME.m/ME.goal*100)}%"></i></div><small class="muted">${Math.round(ME.m/ME.goal*100)}% reached · ${inr(ME.goal-ME.m)} to go</small></section>
   <div class="bal"><small>Available for withdrawal</small><b>${inr(ME.bal)}</b><a class="wbtn" href="#dash-payouts" style="align-self:flex-start;margin-top:6px">Withdraw</a></div></div></div>
  <div class="mile"><span class="ringp" style="--v:${pct}"><span>${pct}%</span></span><div class="mlt"><small>Next milestone</small><b>1 Lakh Club · ${inr(100000)}</b><div class="prog2"><i style="width:${pct}%"></i></div><small>${inr(100000-ME.all)} more to unlock a celebration cake + achievement poster</small></div><a class="wbtn" href="#dash-milestones">View milestones →</a></div>
  <div class="g2"><section class="cardp"><h2>Recent sales<a class="mut" href="#dash-team">See all</a></h2>${table(['Date','Buyer','Course','Status','Commission'],SALES.slice(0,6).map(s=>[dstr(s.d),esc(s.name),esc(s.course),stTag(s.st),inr(s.amt)]),[4])}</section>
   <section class="cardp"><h2>Sales by course · 6 months</h2><div class="dnw"><div class="donut" style="background:conic-gradient(${cg})"><span><span><b>${tot}</b>total sales</span></span></div><ul class="leg">${cn.map((c,i)=>`<li><i style="background:${cols[i]}"></i>${esc(c)}</li>`).join('')}</ul></div></section></div>`;
 },
 courses(){
  if(LIVE){const en=LFAPI.enrolled(),mine=L.visible().filter(c=>en.includes(c.s)),rest=L.visible().filter(c=>!en.includes(c.s));
   const card=(c,own)=>{const th=thumbOf(c),n=(c.modules||[]).length;return `<a class="mcc" href="${own?'#watch-':'#course-'}${c.s}"><span class="im">${th?`<img src="${esc(th)}" alt="" loading="lazy">`:''}<span class="play">${I(own?'<path d="M8 5v14l11-7z" fill="currentColor"/>':IC.lock)}</span></span><span class="bd"><b>${esc(c.t)}</b><small>${own?(n?n+' lessons':'Lessons coming soon'):(c.status==='live'?'Enrol to unlock · '+priceTxt(c.price):'Coming soon')}</small></span></a>`};
   return top('My Courses')+(mine.length?`<div class="mc">${mine.map(c=>card(c,true)).join('')}</div>`:`<div class="empty2">You haven't enrolled in a course yet.</div>`)+(rest.length?`<h2 class="sh2">More skills</h2><div class="mc">${rest.map(c=>card(c,false)).join('')}</div>`:'')}
  const all=L.visible();
  return top('My Courses')+`<div class="seg" role="tablist"><button class="on" type="button">Enrolled (${all.length})</button><button type="button" disabled>Completed (0)</button></div>
  <div class="mc">${all.map(c=>{const th=thumbOf(c),n=(c.modules||[]).length;return `<a class="mcc" href="#watch-${c.s}"><span class="im">${th?`<img src="${esc(th)}" alt="" loading="lazy">`:''}<span class="play">${I('<path d="M8 5v14l11-7z" fill="currentColor"/>')}</span></span><span class="bd"><b>${esc(c.t)}</b><small>By ${esc(c.by)} · ${n?n+' lessons':'Syllabus at launch'}</small><span class="prog2"><i style="width:${c.s==='meta-ads'?25:0}%"></i></span><small>${c.s==='meta-ads'?'25% complete':'Not started'}</small></span></a>`}).join('')}</div>`;
 },
 learn(slug){
  const c=L.getC(slug);if(!c)return top('Course not found')+`<a class="btn btn-main" href="#dash-courses">Back to My Courses</a>`;
  const ms=c.modules||[];
  return top(esc(c.t),`<a class="btn pill pill-o" href="#dash-courses" style="min-height:44px">All courses</a>`)+
  (ms.length?`<div class="player"><aside class="lsn"><h3>${ms.length} lessons</h3><ol>${ms.map((m,i)=>`<li><button type="button" data-l="${i}" class="${i<Math.ceil(ms.length/4)&&c.s==='meta-ads'?'dn':''}"><i>${i+1}</i><span>${esc(m.t)}</span></button></li>`).join('')}</ol></aside><section class="stage2" id="stage2"></section></div>`
  :`<div class="empty2">Lessons for this course will appear here at launch.</div>`);
 },
 training(){return top('Special Training')+`<div class="g3">${[['Live workshop','Skill to income','How to turn your skill into freelance income, step by step.'],['Masterclass','Finding your first client','Where clients are, how to pitch and how to price your work.'],['Masterclass','Building your portfolio','Turn homework into proof that wins work.']].map(t=>`<section class="cardp"><span class="tg2 pu" style="align-self:flex-start">${t[0]}</span><h2>${t[1]}</h2><p class="muted">${t[2]}</p><span class="muted" style="font-size:13px">Schedule shared in class and on WhatsApp</span></section>`).join('')}</div>`},
 quiz(){return top('Quiz')+`<section class="cardp" id="qzc"></section>`},
 certificates(){if(LIVE){const en=LFAPI.enrolled();const mine=L.visible().filter(c=>en.includes(c.s));return top('Certificates')+(mine.length?`<div class="g3">${mine.map(c=>`<div class="cert lock2"><small class="muted">Certificate of completion</small><b style="font:800 20px var(--hd)">${esc(c.t)}</b><span class="muted" style="font-size:14px">Finish every lesson and homework to unlock</span><span class="seal">LOCKED</span></div>`).join('')}</div>`:'<div class="empty2">Enrol in a skill to earn its certificate.</div>')}return top('Certificates')+`<div class="g3">${L.visible().map((c,i)=>`<div class="cert ${i?'lock2':''}"><small class="muted">Certificate of completion</small><b style="font:800 20px var(--hd)">${esc(c.t)}</b><span class="muted" style="font-size:14px">${i?'Complete all lessons to unlock':'Awarded to '+esc(user().name)}</span><span class="seal">${i?'LOCKED':'LEARNIFY'}</span></div>`).join('')}</div>`},
 affiliate(){
  return top('Affiliate Links')+SAMPLE+`<section class="cardp"><h2>Your referral code</h2><div class="copyrow"><code>${esc(refCode().toUpperCase())}</code>${copyBtn('c',refCode().toUpperCase())}</div></section>
  <section class="cardp"><h2>Generate a link</h2><div class="flt"><label style="flex:1;min-width:200px">Course or package<select id="afSel">${L.visible().map(c=>`<option value="${esc(c.s)}">${esc(c.t)}</option>`).join('')}${packages().map(p=>`<option value="pkg-${esc(p.id)}">${esc(p.t)} package</option>`).join('')}</select></label></div><div class="copyrow"><code id="afOut">${esc(refUrl(L.visible()[0]&&L.visible()[0].s))}</code><button class="btn btn-main" type="button" id="afCopy" style="min-height:44px">Copy link</button></div><p class="muted" style="font-size:14px">You earn ${inr(ME.comm)} on every sale made through your link.</p></section>
  <section class="cardp"><h2>Referral list</h2>${table(['#','Name','Joined','Course','Status'],(LIVE?REFS.map((r,i)=>[i+1,esc(r.name),dfull(new Date(r.d)),'—',stTag('Active')]):SALES.slice(0,10).map((s,i)=>[i+1,esc(s.name),dfull(s.d),esc(s.course),stTag('Active')])))}</section>`},
 tools(){
  const caps=[['WhatsApp status','Learn Meta Ads live with daily Zoom classes, in simple Hinglish. Join here: '],['Instagram caption','Skills that pay, taught live. I am learning with Learnify, you can too: '],['Short message','Want to learn a digital skill that pays? Daily live classes + recordings: ']];
  return top('Marketing Tools')+`<div class="g3">${L.visible().slice(0,3).map(c=>`<section class="cardp"><img src="${esc(thumbOf(c))}" alt="" style="width:100%;border-radius:14px;aspect-ratio:16/10;object-fit:cover"><h2>${esc(c.t)}</h2><p class="muted" style="font-size:14px">Course creative to share on WhatsApp and Instagram. Press and hold the image to save it.</p></section>`).join('')}</div>
  <section class="cardp"><h2>Ready captions</h2>${caps.map(c=>`<div class="copyrow"><code>${esc(c[1]+refUrl())}</code>${copyBtn('x',c[1]+refUrl())}</div><small class="muted">${c[0]}</small>`).join('')}</section>`},
 atraining(){return top('Affiliate Training')+`<div class="g3">${[['Getting started','How affiliate links work and how you earn'],['Your first 10 sales','Who to talk to first and what to say'],['Content that sells','Reels, statuses and posts that bring buyers'],['Handling questions','Answer common doubts with confidence'],['Using WhatsApp well','Broadcasts, groups and follow-ups'],['Growing every month','Set goals and track your progress']].map((t,i)=>`<section class="cardp"><span class="tg2 pu" style="align-self:flex-start">Module ${i+1}</span><h2>${t[0]}</h2><p class="muted">${t[1]}</p></section>`).join('')}</div><p class="muted">Training videos are added by the Learnify team.</p>`},
 payouts(){const tot=PAYOUTS.reduce((a,p)=>a+p[1],0);
  return top('Payouts')+SAMPLE+`<div class="g3"><div class="kpi k1"><span>Total paid out</span><b>${inr(tot)}</b><small>${PAYOUTS.length} payouts</small></div><div class="kpi k2"><span>Available balance</span><b>${inr(ME.bal)}</b><small>Ready to withdraw</small></div><div class="kpi k3"><span>Payout day</span><b>Monday</b><small>Every week</small></div></div>
  <section class="cardp"><h2>Request a withdrawal</h2><form class="fm" id="wdF" novalidate><label>Amount (₹)<input type="number" min="500" max="${ME.bal}" value="${ME.bal}" inputmode="numeric"></label><label>Send to<select><option>UPI (from your KYC)</option><option>Bank account (from your KYC)</option></select></label><div class="full"><button class="btn btn-main" type="submit">Request withdrawal</button> <span class="amsg" id="wdM"></span></div></form></section>
  <section class="cardp"><h2>Payout history</h2>${table(['#','Date','Amount','Mode','Status'],PAYOUTS.map((p,i)=>[i+1,dfull(p[0]),inr(p[1]),p[2],stTag(p[3])]),[2])}</section>`},
 wallet(){const rows=[];SALES.slice(0,8).forEach(s=>rows.push([dfull(s.d),'Commission · '+esc(s.name),'<span style="color:#12a150">+'+inr(s.amt)+'</span>']));PAYOUTS.slice(0,2).forEach(p=>rows.push([dfull(p[0]),'Payout · '+p[2],'<span style="color:#d11a4b">−'+inr(p[1])+'</span>']));
  return top('Wallet')+SAMPLE+`<div class="bal" style="max-width:420px"><small>Wallet balance</small><b>${inr(ME.bal)}</b></div><section class="cardp"><h2>Transactions</h2>${table(['Date','Details','Amount'],rows,[2])}</section>`},
 leaderboard(){return top('Leaderboard')+SAMPLE+`<div class="seg" id="lbSeg"><button type="button" class="on" data-k="0">Today</button><button type="button" data-k="1">Last 7 days</button><button type="button" data-k="2">Last 30 days</button><button type="button" data-k="3">All time</button></div><div id="lbBox"></div>`},
 team(){return top('Team Purchases')+SAMPLE+`<section class="cardp"><div class="flt"><label>From<input type="date"></label><label>To<input type="date"></label><button class="btn btn-main" type="button" style="min-height:44px">Search</button></div>${table(['#','Date','Buyer','Course','Status','Commission'],SALES.map((s,i)=>[i+1,dfull(s.d),esc(s.name),esc(s.course),stTag(s.st),inr(s.amt)]),[5])}</section>`},
 associates(){if(LIVE)return top('My Associates')+`<section class="cardp"><h2>People who joined with your link<span class="mut">${REFS.length}</span></h2>${REFS.length?`<ul class="lbl">${REFS.map(r=>`<li><span class="a">${ini(r.name)}</span><span class="n">${esc(r.name)}<br><small class="muted">Joined ${dfull(new Date(r.d))}</small></span></li>`).join('')}</ul>`:'<div class="empty2">Nobody has joined with your link yet. Share it from Affiliate Links.</div>'}</section>`;return top('My Associates')+SAMPLE+`<section class="cardp"><h2>People who joined with your link<span class="mut">${NAMES.length} associates</span></h2><ul class="lbl">${NAMES.map((n,i)=>`<li><span class="a">${ini(n)}</span><span class="n">${esc(n)}<br><small class="muted">Joined ${dfull(ago(i*3+1))}</small></span><span class="tg2 pu">${['Single Skill','Complete'][i%2]}</span></li>`).join('')}</ul></section>`},
 milestones(){let hit=false;return top('Milestones & Rewards')+SAMPLE+`<div class="mile"><span class="ringp" style="--v:${Math.round(ME.all/100000*100)}"><span>${Math.round(ME.all/100000*100)}%</span></span><div class="mlt"><small>Total earned</small><b>${inr(ME.all)}</b><div class="prog2"><i style="width:${Math.round(ME.all/100000*100)}%"></i></div><small>Next: 1 Lakh Club</small></div></div>
  <section class="cardp"><h2>Your journey</h2><ol class="jr">${MILES.map(m=>{const dn=ME.all>=m.amt;let cls=dn?'dn':'';if(!dn&&!hit){cls='cur';hit=true}const p=Math.min(100,Math.round(ME.all/m.amt*100));return `<li class="${cls}"><div class="h"><b>${esc(m.t)}</b><span class="tg2 ${dn?'ok':cls?'pu':'pn'}">${dn?'Unlocked':cls?'In progress':'Locked'}</span><span class="muted" style="margin-left:auto;font-weight:700">${inr(m.amt)}</span></div><span class="muted" style="font-size:14px">Reward: ${esc(m.rw)}</span><div class="prog2"><i style="width:${p}%"></i></div></li>`}).join('')}</ol></section>`},
 missions(){const ms=L.S.missions||[];const cols=['linear-gradient(150deg,#14143a,#4b1ff5)','linear-gradient(150deg,#a60eef,#ff0a8c)','linear-gradient(150deg,#ff6a3d,#ffb400)','linear-gradient(150deg,#0e7a4a,#12a150)'];
  return top('Missions')+(ms.length?`<div class="g3">${ms.map((m,i)=>`<article class="mis" style="background:${m.img?`linear-gradient(transparent 30%,rgba(10,7,24,.85)),url('${esc(blob(m.img))}') center/cover`:cols[i%cols.length]}"><span class="big">${esc(m.target)}<small>sales</small></span><h3>${esc(m.t)}</h3><p>${esc(m.reward)}</p>${m.valid?`<span class="val">Valid: ${esc(m.valid)}</span>`:''}</article>`).join('')}</div>`:`<div class="empty2">No missions are running right now. New missions and their rewards will appear here.</div>`)},
 profile(){const u=user();return top('Profile')+`<section class="cardp"><form class="fm" id="pfF" novalidate><label>Full name<input value="${esc(u.name)}"></label><label>Email<input type="email" value="${esc(u.email)}"></label><label>WhatsApp number<input inputmode="tel" placeholder="10-digit number"></label><label>City<input placeholder="Your city"></label><label class="full">About you<textarea placeholder="Student, freelancer, business owner…"></textarea></label><div class="full"><button class="btn btn-main" type="submit">Save profile</button> <span class="amsg" id="pfM"></span></div></form></section>`},
 kyc(){return top('KYC')+`<section class="cardp"><h2>Verify your details for payouts</h2><p class="muted">We need these once to send your earnings. Your documents are checked by the Learnify team.</p><form class="fm" id="kyF" novalidate><label>Name as on PAN<input></label><label>PAN number<input maxlength="10" style="text-transform:uppercase"></label><label>UPI ID<input placeholder="name@bank"></label><label>Bank account holder<input></label><label>Account number<input inputmode="numeric"></label><label>IFSC<input maxlength="11" style="text-transform:uppercase"></label><label class="full">PAN card photo<input type="file" accept="image/*,application/pdf" style="padding:10px"></label><div class="full"><button class="btn btn-main" type="submit">Submit for verification</button> <span class="amsg" id="kyM"></span></div></form></section>`},
 mentor(){const wa=L.waLink('Hi, I am '+user().name+', a Learnify student. I need help with my course.');
  return top('My Mentor')+`<div class="mentor2"><span class="av5">A</span><div style="flex:1;min-width:220px"><small style="opacity:.8">Your mentor</small><h2>Akash Patel</h2><p>Co-founder · Meta Ads mentor</p></div>${wa?`<a class="wbtn" href="${esc(wa)}" target="_blank" rel="noopener">Message on WhatsApp</a>`:''}</div>
  <section class="cardp"><h2>Community link</h2><p class="muted">Join the Learnify student group for class updates, homework and announcements. The link is shared after enrolment.</p></section>`},
 community(){const soc=L.S.settings.social||{};const items=[['WhatsApp','#25D366','W',soc.whatsapp],['Instagram','#E1306C','IG',soc.instagram],['YouTube','#FF0000','YT',soc.youtube],['Telegram','#229ED9','TG',soc.telegram],['Facebook','#1877F2','f',soc.facebook],['X','#14143a','X',soc.x]];
  return top('Social Community')+`<section class="cardp"><h2>Join our social media</h2><div class="soc">${items.map(i=>{const u=safeUrl(i[3]);return u?`<a href="${esc(u)}" target="_blank" rel="noopener"><span style="background:${i[1]}">${i[2]}</span>${i[0]}<small>Join now →</small></a>`:`<a aria-disabled="true" style="opacity:.55;pointer-events:none"><span style="background:${i[1]}">${i[2]}</span>${i[0]}<small>Coming soon</small></a>`}).join('')}</div></section>`},
 upgrade(){return top('Upgrade Package')+`<p class="muted">You are on the <b>Single Skill</b> plan. Upgrade to Learnify Complete to unlock every skill.</p>`+pkgGrid(true)},
 notifications(){if(LIVE){const ev=[...SALES.map(x=>[x.d,'New sale: '+esc(x.name)+' joined '+esc(x.course)+' · you earn '+inr(x.amt)]),...PAYOUTS.map(p=>[p[0],'Payout of '+inr(p[1])+' · '+p[3]])].sort((a,b)=>b[0]-a[0]).slice(0,30);return top('Notifications')+`<section class="cardp">${ev.length?`<ul class="nt">${ev.map(n=>`<li><i></i><div>${n[1]}<small>${dfull(n[0])}</small></div></li>`).join('')}</ul>`:'<div class="empty2">No notifications yet.</div>'}</section>`}return top('Notifications')+`<section class="cardp"><ul class="nt">${[['New sale! You earned '+inr(COMM),'Today'],['Live class today: Meta Ads Part 05 · Ads Manager','Today'],['Homework for Part 04 is due','Yesterday'],['Your payout of '+inr(5000)+' was sent','3 days ago']].map(n=>`<li><i></i><div>${n[0]}<small>${n[1]}</small></div></li>`).join('')}</ul></section>`+SAMPLE},
 security(){return top('Security')+`<section class="cardp"><h2>Change password</h2><form class="fm" id="scF" novalidate><label class="full">Current password<input type="password" autocomplete="current-password"></label><label>New password<input type="password" autocomplete="new-password"></label><label>Confirm new password<input type="password" autocomplete="new-password"></label><div class="full"><button class="btn btn-main" type="submit">Update password</button> <span class="amsg" id="scM"></span></div></form></section>`}
};
const strip=h=>h.replace(/^<div class="ptop">[\s\S]*?<\/div><\/div>/,'').replace(SAMPLE,'');
const sec=(t,h)=>`<h2 class="sh2">${t}</h2>`+h;
{const O=Object.assign({},VIEWS);
 VIEWS.training=()=>top('Training')+sec('Workshops & masterclasses',strip(O.training()))+sec('Affiliate training',strip(O.atraining()));
 VIEWS.payouts=()=>O.payouts()+sec('Wallet transactions',strip(O.wallet()).replace(/<div class="bal"[\s\S]*?<\/div>/,''));
 VIEWS.team=()=>O.team()+strip(O.associates());
 VIEWS.milestones=()=>O.milestones()+sec('Missions',strip(O.missions()));
 VIEWS.profile=()=>top('Profile & Security')+strip(O.profile())+strip(O.security());
 VIEWS.help=()=>top('Help & Community')+strip(O.mentor())+strip(O.community());}
const AFTER={
 dashboard(){wireCopy();requestAnimationFrame(()=>document.querySelectorAll('.bars i').forEach((b,i)=>setTimeout(()=>b.style.height=b.dataset.h+'px',60+i*60)))},
 affiliate(){wireCopy();const s=document.getElementById('afSel'),o=document.getElementById('afOut'),b=document.getElementById('afCopy');s.addEventListener('change',()=>{o.textContent=refUrl(s.value)});b.addEventListener('click',()=>{try{navigator.clipboard.writeText(o.textContent).then(()=>{b.textContent='Copied!';setTimeout(()=>b.textContent='Copy link',1600)},()=>{})}catch(e){}})},
 tools:wireCopy,
 learn(slug){const c=L.getC(slug);if(!c)return;const ms=c.modules||[];if(!ms.length)return;const st=document.getElementById('stage2');
  const play=i=>{const m=ms[i];document.querySelectorAll('.lsn button').forEach(b=>b.classList.toggle('on',+b.dataset.l===i));
   const url=safeUrl(m.url);
   st.innerHTML=`<div class="scr2">${m.video?`<video controls playsinline src="${esc(blob(m.video))}"></video>`:url?`<div><p style="margin-bottom:14px">This lesson's video is hosted outside Learnify.</p><a class="btn btn-main" href="${esc(url)}" target="_blank" rel="noopener">Open video ↗</a></div>`:`<div><b style="font:800 22px var(--hd);color:#fff">Taught live on Zoom</b><p style="margin-top:8px">The recording appears here after the class.</p></div>`}</div><div class="in"><small class="muted">Lesson ${i+1} of ${ms.length}</small><h2>${esc(m.t)}</h2>${m.d?`<p class="muted">${esc(m.d)}</p>`:''}<div class="navl"><button class="btn pill pill-o" type="button" ${i?'':'disabled'} data-go="${i-1}">← Previous</button><button class="btn btn-main" type="button" ${i<ms.length-1?'':'disabled'} data-go="${i+1}">Next lesson →</button></div></div>`;
   st.querySelectorAll('[data-go]').forEach(b=>b.addEventListener('click',()=>play(+b.dataset.go)))};
  document.querySelectorAll('.lsn button').forEach(b=>b.addEventListener('click',()=>play(+b.dataset.l)));play(0)},
 quiz(){const Q=[['In Ads Manager, which level sets the budget by default?',['Campaign','Ad set','Ad'],1],['What does CTR measure?',['Cost per lead','Clicks divided by impressions','Return on ad spend'],1],['Which tool tracks actions on your website?',['Meta Pixel','Boost button','Audience Insights'],0]];let i=0,score=0;const box=document.getElementById('qzc');
  const draw=()=>{if(i>=Q.length){box.innerHTML=`<h2>Quiz complete</h2><p style="font:800 40px var(--hd)">${score} / ${Q.length}</p><button class="btn btn-main" type="button" id="qzR" style="align-self:flex-start">Try again</button>`;document.getElementById('qzR').onclick=()=>{i=0;score=0;draw()};return}
   const q=Q[i];box.innerHTML=`<small class="muted">Meta Ads basics · Question ${i+1} of ${Q.length}</small><h2>${q[0]}</h2><div class="qz">${q[1].map((o,k)=>`<button class="op" type="button" data-k="${k}">${o}</button>`).join('')}</div>`;
   box.querySelectorAll('.op').forEach(b=>b.onclick=()=>{const k=+b.dataset.k;box.querySelectorAll('.op').forEach(x=>{x.disabled=true;if(+x.dataset.k===q[2])x.classList.add('right')});if(k===q[2])score++;else b.classList.add('wrong');setTimeout(()=>{i++;draw()},900)})};draw()},
 leaderboard(){const draw=k=>{const f=[.02,.12,.4,1][k];const list=LB.map(x=>({n:x.n,v:Math.max(625,Math.round(x.v*f/625)*625)}));const [a,b,c]=list;
  document.getElementById('lbBox').innerHTML=`<div class="hof"><h2>Learnify Hall of Fame</h2><p class="sub">Top earners · ${['today','last 7 days','last 30 days','all time'][k]}</p><div class="pod"><div class="p2"><span class="av4">${ini(b.n)}</span><b>${esc(b.n)}</b><small>${inr(b.v)}</small><span class="st3" style="height:70px">2</span></div><div class="p1"><span class="crown">♛</span><span class="av4">${ini(a.n)}</span><b>${esc(a.n)}</b><small>${inr(a.v)}</small><span class="st3" style="height:100px">1</span></div><div class="p3"><span class="av4">${ini(c.n)}</span><b>${esc(c.n)}</b><small>${inr(c.v)}</small><span class="st3" style="height:50px">3</span></div></div></div>
  <section class="cardp"><ul class="lbl">${list.slice(3).map((x,i)=>`<li><span class="r">#${i+4}</span><span class="a">${ini(x.n)}</span><span class="n">${esc(x.n)}</span><span class="v">${inr(x.v)}</span></li>`).join('')}<li class="me3"><span class="r">#27</span><span class="a">${ini(user().name)}</span><span class="n">You</span><span class="v">${inr(Math.round(ME.all*f/625)*625||625)}</span></li></ul></section>`};
  document.querySelectorAll('#lbSeg button').forEach(b=>b.addEventListener('click',()=>{document.querySelectorAll('#lbSeg button').forEach(x=>x.classList.toggle('on',x===b));draw(+b.dataset.k)}));draw(0)},
 payouts(){formNote('wdF','wdM','Request noted. In this preview nothing is sent; real withdrawals start once payments are connected.')},
 profile(){formNote('pfF','pfM','Saved for this preview.');formNote('scF','scM','Preview only: passwords will work once real accounts are connected.')},
 kyc(){formNote('kyF','kyM','Preview only: details are not stored or sent anywhere yet.')},
 security(){formNote('scF','scM','Preview only: passwords will work once real accounts are connected.')},
 upgrade(){}
};
function formNote(f,m,t){const el=document.getElementById(f);if(el)el.addEventListener('submit',e=>{e.preventDefault();const x=document.getElementById(m);x.textContent=t;x.className='amsg ok'})}
/* ---------- packages ---------- */
function pkgGrid(upgrade){const wa=L.waLink;return `<div class="pkgs">${packages().map(p=>{const price=p.price?inr(p.price):'';const pay=safeUrl(p.pay);const w=wa('Hi Learnify, I want the '+p.t+' package.');
  const href=pay||w||'#contact';const ext=pay||w;const canBuy=LIVE&&p.price&&p.id&&!/^(single|complete)$/.test(p.id);const isSingle=LIVE&&p.id==='single';
  return `<article class="pkg${p.hot?' hot':''}">${p.hot?'<span class="ribbon">Most popular</span>':''}<div class="art" style="background:${p.img?`url('${esc(blob(p.img))}') center/cover`:(p.color||'var(--g)')}">${p.img?'':`<div class="box3"><small>LEARNIFY</small>${esc(p.t)}<br>PACKAGE</div>`}</div><div class="bd"><span class="tg2 pu" style="align-self:flex-start">${esc(p.tag||'')}</span><h3>${esc(p.t)}</h3><div class="pz2">${price||'Ask us'}${price?'<small>one-time</small>':'<small>price on WhatsApp</small>'}</div><ul>${(p.feat||[]).map(f=>`<li>${esc(f)}</li>`).join('')}</ul>${canBuy?`<button type="button" class="btn ${p.hot?'btn-main':'btn-alt'}" data-buy="package:${esc(p.id)}">${upgrade?'Upgrade to '+esc(p.t):'Buy now'}</button>`:isSingle?`<a class="btn ${p.hot?'btn-main':'btn-alt'}" href="#courses">Choose a skill</a>`:`<a class="btn ${p.hot?'btn-main':'btn-alt'}" href="${esc(href)}"${ext?' target="_blank" rel="noopener"':''}>${upgrade?'Upgrade to '+esc(p.t):price?'Buy now':'Get details'}</a>`}</div></article>`}).join('')}</div>`}
function renderPackages(){const r=document.getElementById('pkgRoot');if(!r)return;r.innerHTML=`<div class="jhero"><span class="kick">Pricing</span><h1>One skill, or <span class="gt">all of Learnify.</span></h1><p class="lead" style="margin:16px auto 0">Every plan includes recorded lessons and daily live classes on Zoom, in simple Hinglish.</p></div><section class="band"><div class="wrap">${pkgGrid(false)}<p class="muted" style="text-align:center;margin-top:24px">Not sure which plan fits? <a href="#contact" style="color:var(--pt);font-weight:600">Talk to our team</a>.</p></div></section>`}
/* ---------- jobs ---------- */
const JC=[['All','brief'],['Digital Marketing','link'],['Content Writer','book'],['Video Editor','play'],['Graphic Designer','tool'],['Social Media','globe'],['Sales / BPO','chat'],['Fresher','user']];
let jf={q:'',loc:'',cat:'All'};
function renderJobs(){const r=document.getElementById('jobsRoot');if(!r)return;const jobs=(L.S.jobs||[]);
  const list=jobs.filter(j=>(jf.cat==='All'||j.cat===jf.cat)&&(!jf.q||(j.t+' '+j.co).toLowerCase().includes(jf.q.toLowerCase()))&&(!jf.loc||(j.loc||'').toLowerCase().includes(jf.loc.toLowerCase())));
  r.innerHTML=`<div class="jhero"><span class="kick">Jobs</span><h1>Find your next <span class="gt">job or gig</span></h1><p class="lead" style="margin:16px auto 0">Openings for the skills you learn at Learnify, from internships to full-time roles.</p>
  <form class="jsearch" id="jsF"><input id="jLoc" placeholder="Location" value="${esc(jf.loc)}" aria-label="Location"><input id="jQ" placeholder="Job title or company" value="${esc(jf.q)}" aria-label="Job title or company"><select id="jCat" aria-label="Category">${JC.map(c=>`<option${c[0]===jf.cat?' selected':''}>${c[0]}</option>`).join('')}</select><button class="btn btn-main" type="submit" style="min-height:50px">Search</button></form></div>
  <section class="band"><div class="wrap" style="display:flex;flex-direction:column;gap:28px"><div class="jcats">${JC.slice(1).map(c=>`<button type="button" class="jcat${jf.cat===c[0]?' on':''}" data-c="${esc(c[0])}"><span>${I(IC[c[1]])}</span>${c[0]}</button>`).join('')}</div>
  <div class="head2" style="margin:0"><div><h2>${jf.cat==='All'?'Latest openings':esc(jf.cat)}</h2></div><span class="muted">${list.length} ${list.length===1?'job':'jobs'}</span></div>
  ${list.length?`<div class="jobs">${list.map(j=>{const u=safeUrl(j.apply);return `<article class="job"><b>${esc(j.t)}</b><span class="co">${esc(j.co)}</span><div class="meta3">${j.loc?`<span>${esc(j.loc)}</span>`:''}${j.type?`<span>${esc(j.type)}</span>`:''}${j.pay?`<span>${esc(j.pay)}</span>`:''}${j.cat?`<span>${esc(j.cat)}</span>`:''}</div>${u?`<a class="btn btn-main" href="${esc(u)}" target="_blank" rel="noopener">Apply now ↗</a>`:`<a class="btn btn-alt" href="#contact">Ask about this job</a>`}</article>`}).join('')}</div>`:`<div class="empty2">${jobs.length?'No jobs match your search.':'New openings are posted here by the Learnify team. Check back soon.'}</div>`}
  </div></section>`;
  document.getElementById('jsF').addEventListener('submit',e=>{e.preventDefault();jf={q:document.getElementById('jQ').value.trim(),loc:document.getElementById('jLoc').value.trim(),cat:document.getElementById('jCat').value};renderJobs()});
  r.querySelectorAll('.jcat').forEach(b=>b.addEventListener('click',()=>{jf.cat=jf.cat===b.dataset.c?'All':b.dataset.c;renderJobs()}));
}
/* ---------- admin tabs: packages, jobs, missions, social ---------- */
function adminList(box,o){
  const items=o.items();
  box.innerHTML=`<div class="agrid"><form class="aform" id="axF" novalidate style="grid-column:1/-1"><h2>${o.title}</h2><small class="muted">${o.note}</small><div class="fm">${o.fields.map(f=>`<label class="${f.full?'full':''}">${f.l}${f.ta?`<textarea id="ax-${f.k}" placeholder="${esc(f.ph||'')}"></textarea>`:f.opts?`<select id="ax-${f.k}">${f.opts.map(x=>`<option>${esc(x)}</option>`).join('')}</select>`:`<input id="ax-${f.k}" placeholder="${esc(f.ph||'')}" ${f.num?'type="number" inputmode="numeric"':''}>`}</label>`).join('')}${o.img?'<label class="full">Image (optional)<input type="file" id="ax-img" accept="image/*" style="padding:10px"></label>':''}</div>
  <div class="abar"><button class="btn btn-main" type="submit">${o.add}</button><span class="amsg" id="axM"></span></div>
  <h2 style="margin-top:10px">${o.listTitle} (${items.length})</h2><div class="arev">${items.map(it=>`<div><span><b>${esc(it.t)}</b><br><small class="muted">${esc(o.sub(it))}</small></span><button type="button" class="bsm dn" data-del="${esc(it.id)}">Delete</button></div>`).join('')||'<p class="muted">Nothing added yet.</p>'}</div></form></div>`;
  let img='';const fi=document.getElementById('ax-img');if(fi)fi.onchange=async()=>{const f=fi.files[0];if(f){const id=await L.upload(f,'axM');if(id)img=id}};
  box.querySelectorAll('[data-del]').forEach(b=>b.onclick=async()=>{if(b.dataset.sure!=='1'){b.dataset.sure='1';b.textContent='Click again';return}try{await L.S.db.doc(o.col+'/'+b.dataset.del).delete();adminList(box,o)}catch(e){L.msg('axM','Could not delete.')}});
  document.getElementById('axF').onsubmit=async e=>{e.preventDefault();const d={};for(const f of o.fields){const v=document.getElementById('ax-'+f.k).value.trim();d[f.k]=f.num?(v?Math.max(0,Math.round(+v)):null):v}
   const err=o.check(d);if(err){L.msg('axM',err);return}if(img)d.img=img;d.ts=Date.now();if(!L.S.db){L.msg('axM','Saving is not available in this view.');return}
   try{await L.S.db.collection(o.col).add(o.map?o.map(d):d);adminList(box,o);L.msg('axM','Added. It is live on the site.',true)}catch(err){L.msg('axM','Could not save. Please try again.')}};
}
const ADMIN={
 packages:box=>adminList(box,{col:'packages',title:'Add a package',note:'Once you add your first package, these replace the sample Starter / Pro / Elite plans on the site. Features: one per line.',add:'Add package',listTitle:'Packages on the site',
  items:()=>L.S.pkgs||[],sub:p=>(p.price?priceTxt(p.price):'Price on WhatsApp')+' · '+(p.tag||''),
  fields:[{k:'t',l:'Package name',ph:'e.g. Pro'},{k:'tag',l:'Short label',ph:'e.g. 3 courses bundle'},{k:'price',l:'Price (₹)',num:1,ph:'Leave empty to ask on WhatsApp'},{k:'pay',l:'Payment link',ph:'https://rzp.io/l/…'},{k:'feat',l:'Features (one per line)',ta:1,full:1},{k:'courses',l:'Skills included',ph:'all — ya slugs: meta-ads,content-creation'},{k:'hot',l:'Highlight as most popular?',opts:['No','Yes']},{k:'ord',l:'Order on page',num:1,ph:'1, 2, 3…'}],img:1,
  check:d=>!d.t?'Please add a package name.':(d.pay&&!safeUrl(d.pay))?'Payment link must start with https://':'',
  map:d=>({t:d.t,tag:d.tag,price:d.price,pay:d.pay,courses:d.courses||'all',feat:d.feat.split('\n').map(x=>x.trim()).filter(Boolean),hot:d.hot==='Yes',ord:d.ord??99,img:d.img||'',ts:d.ts})}),
 jobs:box=>adminList(box,{col:'jobs',title:'Post a job',note:'Only post real openings, with the employer\'s permission.',add:'Post job',listTitle:'Jobs on the site',
  items:()=>L.S.jobs||[],sub:j=>[j.co,j.loc,j.cat].filter(Boolean).join(' · '),
  fields:[{k:'t',l:'Job title',ph:'e.g. Social Media Executive'},{k:'co',l:'Company',ph:'Company name'},{k:'loc',l:'Location',ph:'e.g. Jaipur / Remote'},{k:'type',l:'Type',opts:['Full-time','Part-time','Internship','Freelance']},{k:'pay',l:'Salary (optional)',ph:'e.g. ₹15,000–20,000 / month'},{k:'cat',l:'Category',opts:JC.slice(1).map(c=>c[0])},{k:'apply',l:'Apply link',ph:'https://…',full:1}],
  check:d=>!d.t||!d.co?'Please add a job title and company.':(d.apply&&!safeUrl(d.apply))?'Apply link must start with https://':''}),
 missions:box=>adminList(box,{col:'missions',title:'Add a mission',note:'Missions show in every student\'s panel with the target and reward.',add:'Add mission',listTitle:'Missions running',
  items:()=>L.S.missions||[],sub:m=>m.target+' sales · '+m.reward,
  fields:[{k:'t',l:'Mission name',ph:'e.g. Family Happiness Mission'},{k:'target',l:'Target sales',num:1},{k:'reward',l:'Reward',ph:'e.g. Family dinner'},{k:'valid',l:'Valid dates',ph:'e.g. 1 Dec – 31 Dec 2026'}],img:1,
  check:d=>!d.t||!d.target||!d.reward?'Please add a name, target and reward.':''})
};
/* social links are part of settings */
function adminSocial(box){const s=(L.S.settings.social)||{};const K=[['whatsapp','WhatsApp group / channel'],['instagram','Instagram'],['youtube','YouTube'],['telegram','Telegram'],['facebook','Facebook'],['x','X (Twitter)']];
  box.innerHTML=`<div class="agrid"><form class="aform" id="soF" novalidate style="grid-column:1/-1"><h2>Social links</h2><small class="muted">Shown on the student Social Community page.</small><div class="fm">${K.map(k=>`<label>${k[1]}<input id="so-${k[0]}" value="${esc(s[k[0]]||'')}" placeholder="https://…"></label>`).join('')}</div><div class="abar"><button class="btn btn-main" type="submit">Save links</button><span class="amsg" id="soM"></span></div></form></div>`;
  document.getElementById('soF').onsubmit=async e=>{e.preventDefault();const o={};for(const k of K){const v=document.getElementById('so-'+k[0]).value.trim();if(v&&!safeUrl(v)){L.msg('soM',k[1]+' link must start with https://');return}o[k[0]]=v}
   if(!L.S.db){L.msg('soM','Saving is not available in this view.');return}try{await L.S.db.doc('site/settings').set(Object.assign({},L.S.settings,{social:o}));L.msg('soM','Saved.',true)}catch(err){L.msg('soM','Could not save.')}}}
ADMIN.social=adminSocial;
/* ---------- db subscriptions for new collections ---------- */
L.onDb(db=>{
  db.collection('packages').onSnapshot(s=>{L.S.pkgs=s.docs.map(d=>Object.assign({id:d.id},d.data())).sort((a,b)=>(a.ord??99)-(b.ord??99));rerender()},()=>{});
  db.collection('jobs').orderBy('ts','desc').onSnapshot(s=>{L.S.jobs=s.docs.map(d=>Object.assign({id:d.id},d.data()));rerender()},()=>{});
  db.collection('missions').orderBy('ts','desc').onSnapshot(s=>{L.S.missions=s.docs.map(d=>Object.assign({id:d.id},d.data()));rerender()},()=>{});
});
/* ---------- live site: real course player, leaderboard, forms, buy buttons ---------- */
if(LIVE){
 VIEWS.learn=slug=>{const c=L.getC(slug);return top(esc(c?c.t:'Course'),`<a class="btn pill pill-o" href="#dash-courses" style="min-height:44px">My courses</a>`)+'<div id="lvBox"><div class="empty2">Loading lessons…</div></div>'};
 AFTER.learn=async slug=>{const box=document.getElementById('lvBox');let d;
  try{d=await LFAPI.j('/learn/'+encodeURIComponent(slug))}catch(e){const c=L.getC(slug);
   box.innerHTML=`<section class="cardp lockbox">${I(IC.lock)}<b>This course is locked</b><p class="muted">Enrol to unlock every lesson, recording and homework.</p>${c&&c.status==='live'?`<button type="button" class="btn btn-main" data-buy="course:${esc(slug)}">Enroll now · ${priceTxt(c.price)}</button>`:'<a class="btn btn-alt" href="#courses">See all skills</a>'}</section>`;return}
  const ms=d.course.modules||[],done=new Set(d.done||[]);
  if(!ms.length){box.innerHTML='<div class="empty2">Lessons for this course will appear here soon. Live classes run daily on Zoom.</div>';return}
  box.innerHTML=`<div class="player"><aside class="lsn"><h3>${ms.length} lessons · <span id="pdone">${done.size}</span> done</h3><ol>${ms.map((m,i)=>`<li><button type="button" data-l="${i}"><i>${i+1}</i><span>${esc(m.t)}</span>${done.has(i)?'<span class="ck">✓</span>':''}</button></li>`).join('')}</ol></aside><section class="stage2" id="stage2"></section></div>`;
  const st=document.getElementById('stage2'),wm=esc(d.watermark||'');
  const mark=async i=>{if(done.has(i))return;try{const r=await LFAPI.j('/progress',{method:'POST',body:JSON.stringify({slug,lesson:i})});r.done.forEach(x=>done.add(x));document.getElementById('pdone').textContent=done.size;const b=box.querySelector(`.lsn button[data-l="${i}"]`);if(b&&!b.querySelector('.ck'))b.insertAdjacentHTML('beforeend','<span class="ck">✓</span>')}catch(e){}};
  const play=i=>{const m=ms[i];box.querySelectorAll('.lsn button').forEach(b=>b.classList.toggle('on',+b.dataset.l===i));
   st.innerHTML=`${m.drive?`<div class="gdv" oncontextmenu="return false"><iframe src="https://drive.google.com/file/d/${encodeURIComponent(m.drive)}/preview" title="${esc(m.t)}" allow="autoplay; fullscreen" allowfullscreen></iframe><span class="dvblock" aria-hidden="true"></span><span class="wm" aria-hidden="true">${wm}</span></div>`:`<div class="scr2"><div><b style="font:700 22px var(--hd);color:#fff">Taught live on Zoom</b><p style="margin-top:8px">The recording appears here after the class.</p></div></div>`}
   <div class="in"><small class="muted">Lesson ${i+1} of ${ms.length}</small><h2>${esc(m.t)}</h2>${m.d?`<p class="muted">${esc(m.d)}</p>`:''}<div class="navl"><button class="btn pill pill-o" type="button" ${i?'':'disabled'} data-go="${i-1}">← Previous</button><button class="btn btn-alt" type="button" data-done="${i}">${done.has(i)?'Completed ✓':'Mark as complete'}</button><button class="btn btn-main" type="button" ${i<ms.length-1?'':'disabled'} data-go="${i+1}">Next lesson →</button></div></div>`;
   st.querySelectorAll('[data-go]').forEach(b=>b.addEventListener('click',()=>{mark(i);play(+b.dataset.go)}));
   st.querySelector('[data-done]').addEventListener('click',e=>{mark(i);e.currentTarget.textContent='Completed ✓'})};
  box.querySelectorAll('.lsn button').forEach(b=>b.addEventListener('click',()=>play(+b.dataset.l)));
  const first=ms.findIndex((m,i)=>!done.has(i));play(first<0?0:first)};
 AFTER.leaderboard=()=>{const R=['today','7d','30d','all'],cache={};
  const draw=async k=>{const box=document.getElementById('lbBox');if(!cache[k]){box.innerHTML='<div class="empty2">Loading…</div>';try{cache[k]=(await LFAPI.j('/leaderboard?range='+R[k])).top}catch(e){cache[k]=[]}}
   const list=cache[k];if(!list.length){box.innerHTML='<div class="empty2">No sales in this period yet. Be the first on the board!</div>';return}
   const pod=(x,cls,h,r)=>x?`<div class="${cls}">${r===1?'<span class="crown">♛</span>':''}<span class="av4">${ini(x.n)}</span><b>${esc(x.n)}</b><small>${inr(x.v)}</small><span class="st3" style="height:${h}px">${r}</span></div>`:'<div></div>';
   box.innerHTML=`<div class="hof"><h2>Learnify Hall of Fame</h2><p class="sub">Top earners · ${['today','last 7 days','last 30 days','all time'][k]}</p><div class="pod">${pod(list[1],'p2',70,2)}${pod(list[0],'p1',100,1)}${pod(list[2],'p3',50,3)}</div></div>${list.length>3?`<section class="cardp"><ul class="lbl">${list.slice(3).map((x,i)=>`<li><span class="r">#${i+4}</span><span class="a">${ini(x.n)}</span><span class="n">${esc(x.n)}</span><span class="v">${inr(x.v)}</span></li>`).join('')}</ul></section>`:''}`};
  document.querySelectorAll('#lbSeg button').forEach(b=>b.addEventListener('click',()=>{document.querySelectorAll('#lbSeg button').forEach(x=>x.classList.toggle('on',x===b));draw(+b.dataset.k)}));draw(0)};
 AFTER.payouts=()=>liveForm('wdF','wdM',async v=>{await LFAPI.j('/payouts',{method:'POST',body:JSON.stringify({amount:Number(v[0]),method:/bank/i.test(v[1])?'bank':'upi'})});liveLoaded=false;setTimeout(()=>show('dash-payouts'),1200);return 'Withdrawal requested. The team pays out every Monday.'});
 AFTER.profile=()=>{const f=document.getElementById('pfF');if(f){const u=user(),ins=f.querySelectorAll('input,textarea');ins[1].disabled=true;ins[2].value=u.phone||'';ins[3].value=u.city||'';ins[4].value=u.about||''}
  liveForm('pfF','pfM',async v=>{await LFAPI.j('/me',{method:'PUT',body:JSON.stringify({name:v[0],phone:v[2],city:v[3],about:v[4]})});return 'Profile saved.'});
  liveForm('scF','scM',async v=>{if(v[1]!==v[2])throw new Error('New passwords do not match');await LFAPI.j('/me/password',{method:'POST',body:JSON.stringify({current:v[0],next:v[1]})});return 'Password updated.'})};
 AFTER.kyc=async()=>{liveForm('kyF','kyM',async v=>{await LFAPI.j('/kyc',{method:'POST',body:JSON.stringify({name:v[0],pan:v[1],upi:v[2],holder:v[3],account:v[4],ifsc:v[5]})});return 'Submitted. The team will verify it within 2 working days.'});
  try{const k=await LFAPI.j('/kyc');if(k.status!=='none'){const m=document.getElementById('kyM');m.textContent='Status: '+k.status+(k.note?' · '+k.note:'');m.className='amsg '+(k.status==='approved'?'ok':'')}}catch(e){}};
}

window.LFApp={show,page(p){if(p==='packages')renderPackages();if(p==='jobs')renderJobs()},admin:ADMIN,reset(){const r=document.getElementById('app');if(r){r.innerHTML='';delete r.dataset.ready}}};
plansHome();
L.route();
}
