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
const HUES=[['#4b1ff5','#a60eef'],['#ff6a3d','#ffb400'],['#0ea47a','#3ddc97'],['#a60eef','#ff0a8c'],['#1d6cf2','#4fc3ff'],['#e0245e','#ff7a59']];
const hueOf=n=>{let h=0;for(const ch of String(n||''))h=(h*31+ch.charCodeAt(0))>>>0;return HUES[h%HUES.length]};
function avatar(n,av,cls=''){const [a,b]=hueOf(n);return `<span class="avx ${cls}" style="--a:${a};--b:${b}">${av?`<img src="/api/img/${esc(av)}" alt="" loading="lazy" decoding="async">`:`<b>${esc(ini(n))}</b>`}</span>`}
const maskE=e=>{const [u,d]=String(e||'').split('@');if(!u||!d)return '';const k=u.length<=3?1:2;return u.slice(0,k)+'•'.repeat(Math.max(3,Math.min(6,u.length-k-1)))+(u.length>3?u.slice(-1):'')+'@'+d};
const who=(n,em,av,cls='')=>`<span class="who ${cls}">${avatar(n,av)}<span class="wn"><b>${esc(n)}</b>${em?`<small>${esc(em)}</small>`:''}</span></span>`;
let SAMPLE='<p class="sample2">Preview with sample numbers. Real earnings, sales and payouts appear once student accounts and payments are connected.</p>';
const LIVE=!!window.LFAPI;let liveLoaded=false,REFS=[];
async function loadLive(){if(!LIVE||!L.getUser()){liveLoaded=true;return}
 try{const a=await LFAPI.j('/affiliate');SAMPLE='';
  const en=LFAPI.enrolled(),nAll=L.visible().length;
  Object.assign(ME,{all:a.all,today:a.today,w:a.d7,m:a.d30,bal:a.balance,todayN:a.todayN,wN:a.d7N,mN:a.d30N,allN:a.allN,pending:a.pending,comm:a.commission,minPayout:a.minPayout,code:a.code,
   goal:Math.max(10000,Math.ceil(((a.d30||0)*1.25)/5000)*5000),pkg:en.length&&en.length>=nAll?'Complete':en.length?'Single Skill':'Free'});
  SALES.splice(0,SALES.length,...a.sales.map(x=>({d:new Date(x.d),name:x.name,av:x.av||'',em:x.em||'',course:x.course,amt:x.amt,st:x.st==='pending'?'Pending':x.st==='cancelled'?'Cancelled':x.st==='paid'?'Paid':'Approved'})));
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
  const wa=L.waLink('Hi, I am '+u.name+', a Learnify student. I need help.');
  return `<div class="ap"><aside class="side2" id="side2" aria-label="Student menu">
   <div class="me2"><a class="av3" href="#dash-profile" aria-label="My profile">${avatar(u.name,u.avatar,"lg")}</a><span class="mei"><b>${esc(u.name)}</b><small>${esc(maskE(u.email))}</small><span class="pk">${esc(ME.pkg)} plan</span></span></div>
   <a class="meearn" href="#dash-payouts"><small>Total earned</small><b>${inr(ME.all||0)}</b><span>Wallet ${inr(ME.bal||0)} →</span></a>
   <div class="sidenav" role="navigation" aria-label="Dashboard sections">${nav}</div>
   ${wa?`<a class="sidehelp" href="${esc(wa)}" target="_blank" rel="noopener"><b>Need help?</b><small>Message your mentor on WhatsApp</small></a>`:''}
   <a href="#login" class="lo2" id="lo2">${I(IC.out)}<span>Log out</span></a></aside><div class="scrim" id="scrim"></div><main class="mainp" id="mainp"></main></div>`;
}
const GROUP_OF=id=>{const m=MODS.find(x=>x[1]===id);return m&&m[0]?m[0]:'Overview'};
function top(title,extra=''){const hr=new Date().getHours(),greet=hr<12?'Good morning':hr<17?'Good afternoon':'Good evening';
  return `<div class="ptop"><button class="sbtn" type="button" id="sbtn" aria-label="Open menu">${I(IC.menu)}</button><div class="pttl"><small>${current==='dashboard'?greet+' · '+new Date().toLocaleDateString('en-IN',{weekday:'long',day:'numeric',month:'long'}):esc(GROUP_OF(current))}</small><h1>${title}</h1></div><div class="sp">${extra}${LIVE?`<button class="bell" type="button" id="bellB" aria-label="Notifications">${I(IC.bell)}<span class="bn" id="bellN" hidden></span></button>`:`<a class="bell" href="#dash-notifications" aria-label="Notifications">${I(IC.bell)}<i></i></a>`}<a class="tav" href="#dash-profile" aria-label="Profile">${avatar(user().name,user().avatar)}</a></div></div>`}
function mount(){
  const root=document.getElementById('app');if(root.dataset.ready)return;root.innerHTML=shell();root.dataset.ready='1';
  document.getElementById('lo2').addEventListener('click',e=>{e.preventDefault();L.logout()});
  const sd=document.getElementById('side2'),sc=document.getElementById('scrim');
  sc.addEventListener('click',()=>{sd.classList.remove('open');sc.classList.remove('open')});
  sd.addEventListener('click',e=>{if(e.target.closest('a')){sd.classList.remove('open');sc.classList.remove('open')}});
}
function show(hash){
  mount();
  {const nv=document.querySelector('nav');if(nv)document.documentElement.style.setProperty('--navh',nv.offsetHeight+'px')}
  if(LIVE&&!liveLoaded){document.getElementById('mainp').innerHTML='<div class="empty2">Loading your dashboard…</div>';loadLive().then(()=>{const r=document.getElementById('app');r.innerHTML='';delete r.dataset.ready;show(hash)});return}
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
  enter(m);
  if(window.__lfAfterShow)window.__lfAfterShow();
}
function rerender(){plansHome();if(L.curPage()==='dashboard')show(current);const p=L.curPage();if(p==='packages')renderPackages();if(p==='jobs')renderJobs()}
/* ---------- motion ---------- */
const RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
function enter(m){[...m.children].forEach((el,i)=>{el.style.setProperty('--d',Math.min(i,10)*55+'ms');el.classList.remove('rin');void el.offsetWidth;el.classList.add('rin')});countUps(m)}
function countUps(scope){scope.querySelectorAll('[data-cu]').forEach(el=>{const to=Number(el.dataset.cu)||0,fmt=el.dataset.fmt||'inr';const f=v=>fmt==='inr'?inr(Math.round(v)):Math.round(v).toLocaleString('en-IN')+(fmt==='pct'?'%':'');
  if(RM||!to){el.textContent=f(to);return}const t0=performance.now(),dur=1100;const tick=t=>{const k=Math.min(1,(t-t0)/dur),e=1-Math.pow(2,-10*k);el.textContent=f(to*(k>=1?1:e));if(k<1)requestAnimationFrame(tick)};requestAnimationFrame(tick)})}
function smooth(pts){if(pts.length<2)return '';let d=`M${pts[0][0]},${pts[0][1]}`;for(let i=0;i<pts.length-1;i++){const p0=pts[i-1]||pts[i],p1=pts[i],p2=pts[i+1],p3=pts[i+2]||p2;const lo=Math.min(p1[1],p2[1]),hi=Math.max(p1[1],p2[1]),cl=v=>Math.max(lo,Math.min(hi,v));const c1=[p1[0]+(p2[0]-p0[0])/6,cl(p1[1]+(p2[1]-p0[1])/6)],c2=[p2[0]-(p3[0]-p1[0])/6,cl(p2[1]-(p3[1]-p1[1])/6)];d+=` C${c1[0].toFixed(1)},${c1[1].toFixed(1)} ${c2[0].toFixed(1)},${c2[1].toFixed(1)} ${p2[0]},${p2[1]}`}return d}
function areaChart(data,{h=230,id='ac'}={}){const W=640,H=h,pl=8,pr=8,pt=20,pb=34,n=data.length;const mx=Math.max(1,...data.map(d=>d.v));const step=(W-pl-pr)/Math.max(1,n-1);
  const pts=data.map((d,i)=>[Math.round(pl+i*step),Math.round(pt+(H-pt-pb)*(1-d.v/mx))]);const line=smooth(pts),area=line+` L${pts[n-1][0]},${H-pb} L${pts[0][0]},${H-pb} Z`;
  return `<div class="achart" id="${id}"><svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="none" aria-hidden="true"><defs><linearGradient id="${id}g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" style="stop-color:var(--acc,#5b2bf5);stop-opacity:.22"/><stop offset="1" style="stop-color:var(--acc,#5b2bf5);stop-opacity:0"/></linearGradient><linearGradient id="${id}l" x1="0" y1="0" x2="1" y2="0"><stop offset="0" style="stop-color:var(--acc,#5b2bf5)"/><stop offset="1" style="stop-color:var(--acc2,#8b3cf6)"/></linearGradient></defs>
   ${[0,1,2,3].map(k=>`<line class="gl" x1="0" x2="${W}" y1="${pt+(H-pt-pb)*k/3}" y2="${pt+(H-pt-pb)*k/3}"/>`).join('')}
   <path class="ar" d="${area}" fill="url(#${id}g)"/><path class="ln" d="${line}" style="stroke:var(--acc,#5b2bf5)" pathLength="1"/>
   ${pts.map((p,i)=>`<circle class="dt" cx="${p[0]}" cy="${p[1]}" r="5" style="--i:${i}"/>`).join('')}</svg>
   <div class="axl">${data.map(d=>`<span>${esc(d.l)}</span>`).join('')}</div>
   <div class="hz">${data.map((d,i)=>`<button type="button" tabindex="-1" style="left:${pts[i][0]/W*100}%;--y:${pts[i][1]/H*100}%" data-tip="${esc(d.l)} · ${inr(d.v)}"></button>`).join('')}</div></div>`}
const agoTxt=d=>{const m=Math.round((Date.now()-d)/60000);if(m<1)return 'just now';if(m<60)return m+'m ago';const h=Math.round(m/60);if(h<24)return h+'h ago';const dd=Math.round(h/24);return dd<7?dd+'d ago':dstr(d)};
const ring=(pct,label,size=92)=>{const r=size/2-7,c=2*Math.PI*r;return `<span class="ring3" style="width:${size}px;height:${size}px"><svg viewBox="0 0 ${size} ${size}"><circle cx="${size/2}" cy="${size/2}" r="${r}" class="rbg"/><circle cx="${size/2}" cy="${size/2}" r="${r}" class="rfg" style="stroke-dasharray:${c};stroke-dashoffset:${c};--to:${c*(1-pct/100)}"/></svg><b>${label}</b></span>`};
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

/* ---------- premium dashboard (v3) ---------- */
{
 const TOP_AS={};
 const firstName=()=>esc(user().name.split(' ')[0]||'there');
 const ownedCourses=()=>{const en=LIVE?LFAPI.enrolled():L.visible().map(c=>c.s);return L.visible().filter(c=>en.includes(c.s))};
 const levelInfo=()=>{let i=MILES.findIndex(m=>ME.all<m.amt);if(i<0)i=MILES.length-1;const prev=i?MILES[i-1].amt:0,nx=MILES[i];const pct=Math.max(0,Math.min(100,Math.round((ME.all-prev)/(nx.amt-prev)*100)));return{i,prev,nx,pct}};
 const walletCard=(big)=>`<section class="walc${big?' big':''}"><div class="wch"><span class="wlogo">L</span><small>Learnify Wallet</small><span class="chip" aria-hidden="true"></span></div>
   <small class="wlb">Available to withdraw</small><b class="wamt" data-cu="${ME.bal||0}">${inr(ME.bal||0)}</b>
   <div class="wsplit"><span><i class="g"></i>Pending <b>${inr(ME.pending||0)}</b></span><span><i class="y"></i>Min. withdrawal <b>${inr(ME.minPayout||500)}</b></span></div>
   <div class="wbtns"><a class="wb1" href="#dash-payouts">Withdraw</a><a class="wb2" href="#dash-payouts" data-scroll="hist">History</a></div></section>`;
 VIEWS.dashboard=()=>{
  const lv=levelInfo(),own=ownedCourses(),c0=own[0];
  const wk=WEEK.reduce((a,w)=>a+w.v,0);
  const qa=[[refUrl(),'link','Copy my link','Share & earn '+inr(ME.comm||625)+' per sale','copy'],[c0?'#watch-'+c0.s:'#dash-courses','play','Continue learning',c0?esc(c0.t):'Pick a skill to start'],['#dash-payouts','wal','Withdraw',inr(ME.bal||0)+' available'],['#dash-tools','tool','Marketing kit','Creatives & captions']];
  return top('Welcome back, '+firstName(),`<button type="button" class="btn btn-alt tbtn" id="dlRep" title="Download earnings report (CSV)">${I('<path d="M12 4v12M6 10l6 6 6-6M4 20h16"/>')}<span>Report</span></button><a class="btn btn-main tbtn" href="#dash-affiliate">${I(IC.link)}<span>Share &amp; earn</span></a>`)+SAMPLE+
  `<div class="dg">
   <section class="hero3 c8"><span class="orb o1"></span><span class="orb o2"></span><span class="orb o3"></span>
    <div class="h3l"><small>Total earnings</small><b class="hbig" data-cu="${ME.all||0}">${inr(ME.all||0)}</b>
     <span class="hpill">${I(IC.up)} ${inr(wk)} in the last 7 days</span>
     <div class="hstats"><div><small>Today</small><b data-cu="${ME.today||0}">${inr(ME.today||0)}</b><em>${ME.todayN||0} sales</em></div><div><small>7 days</small><b data-cu="${ME.w||0}">${inr(ME.w||0)}</b><em>${ME.wN||0} sales</em></div><div><small>30 days</small><b data-cu="${ME.m||0}">${inr(ME.m||0)}</b><em>${ME.mN||0} sales</em></div></div></div>
    <div class="h3r">${areaChart(WEEK,{h:330,id:'hsp'})}</div></section>
   <div class="c4">${walletCard(false)}</div>
   <div class="qa c12">${qa.map((q,i)=>q[4]==='copy'?`<button type="button" class="qt" data-copy-qa="${esc(q[0])}" style="--i:${i}"><span class="qi">${I(IC[q[1]])}</span><span><b>${q[2]}</b><small>${q[3]}</small></span></button>`:`<a class="qt" href="${esc(q[0])}" style="--i:${i}"><span class="qi">${I(IC[q[1]])}</span><span><b>${q[2]}</b><small>${q[3]}</small></span></a>`).join('')}</div>
   <section class="cardp c8"><div class="chd"><div><h2>Earnings</h2><small class="muted">Commission per day · last 7 days</small></div><b class="chv" data-cu="${wk}">${inr(wk)}</b></div>${wk?areaChart(WEEK,{h:260,id:'ern'}):`<div class="empty3">${I(IC.up)}<b>Your first sale will show up here</b><small>Share your link and earn ${inr(ME.comm||625)} on every course sold.</small><a class="btn btn-main" href="#dash-affiliate">Get my link</a></div>`}</section>
   <section class="cardp c4 cont"><h2>Continue learning</h2>${c0?`<a class="ccl" href="#watch-${esc(c0.s)}"><span class="cth">${thumbOf(c0)?`<img src="${esc(thumbOf(c0))}" alt="" loading="lazy">`:''}<span class="cpl">${I('<path d="M8 5v14l11-7z" fill="currentColor"/>')}</span></span></a><div class="crw"><span id="cRing">${ring(0,'0%',78)}</span><div><b>${esc(c0.t)}</b><small class="muted" id="cTxt">${(c0.modules||[]).length} lessons</small></div></div><a class="btn btn-main" href="#watch-${esc(c0.s)}" id="cBtn">Resume course</a>`:`<div class="empty3">${I(IC.book)}<b>No course yet</b><small>Enrol in a skill to start learning.</small><a class="btn btn-main" href="#courses">Explore skills</a></div>`}</section>
   <section class="cardp c7"><div class="chd"><h2>Recent activity</h2><a class="mut2" href="#dash-team">See all</a></div>${SALES.length?`<ul class="feed">${SALES.slice(0,6).map((x,i)=>`<li style="--i:${i}">${avatar(x.name,x.av)}<div><b>${esc(x.name)}</b> joined <b>${esc(x.course)}</b><small>${x.em?`<span class="eml">${esc(x.em)}</span> · `:""}${agoTxt(x.d)} · ${stTag(x.st)}</small></div><span class="famt">+${inr(x.amt)}</span></li>`).join('')}</ul>`:`<div class="empty3">${I(IC.team)}<b>No sales yet</b><small>When someone buys with your link, it appears here instantly.</small></div>`}</section>
   <section class="cardp c5"><div class="chd"><h2>Top earners</h2><a class="mut2" href="#dash-leaderboard">Leaderboard</a></div><div id="topEarn"><div class="skel"></div><div class="skel"></div><div class="skel"></div></div></section>
   <section class="lvl c12"><div class="lvh"><div><small>Your level</small><b>${lv.i?esc(MILES[lv.i-1].t):'Getting started'}</b></div><div class="lvn"><small>Next: ${esc(lv.nx.t)}</small><b>${inr(Math.max(0,lv.nx.amt-ME.all))} to go</b></div></div>
    <div class="lvt"><i style="--w:${Math.round((lv.i+lv.pct/100)/MILES.length*100)}%"></i>${MILES.map((m,i)=>`<span class="lvd ${i<lv.i?'dn':i===lv.i?'cur':''}" style="left:${(i+1)/MILES.length*100}%"><em>${esc(m.t)}</em><small>${inr(m.amt)}</small></span>`).join('')}</div>
    <p class="lvr">${I('<rect x="3" y="8" width="18" height="13" rx="2"/><path d="M12 8v13M3 12h18M12 8a3 3 0 1 1-3-3c2 0 3 3 3 3zm0 0a3 3 0 1 0 3-3c-2 0-3 3-3 3z"/>')}Next reward: <b>${esc(lv.nx.rw)}</b></p><a class="wbtn" href="#dash-milestones">All rewards →</a></section>
  </div>`};
 AFTER.dashboard=async()=>{
  const dl=document.getElementById('dlRep');if(dl)dl.addEventListener('click',()=>{const rows=[['Type','Date','Name','Course / Mode','Amount (INR)','Status'],...SALES.map(x=>['Commission',dfull(x.d),x.name,x.course,x.amt,x.st]),...PAYOUTS.map(p=>['Payout',dfull(p[0]),'',p[2],-p[1],p[3]])];
   const csv=rows.map(r=>r.map(c=>`"${String(c).replace(/"/g,'""')}"`).join(',')).join('\n');const a=document.createElement('a');a.href=URL.createObjectURL(new Blob(['\ufeff'+csv],{type:'text/csv'}));a.download=`learnify-earnings-${new Date().toISOString().slice(0,10)}.csv`;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),2000)});
  document.querySelectorAll('[data-copy-qa]').forEach(b=>b.addEventListener('click',()=>{try{navigator.clipboard.writeText(b.dataset.copyQa).then(()=>{const s=b.querySelector('small'),o=s.textContent;s.textContent='Link copied ✓';b.classList.add('ok');setTimeout(()=>{s.textContent=o;b.classList.remove('ok')},1800)})}catch(e){}}));
  const own=ownedCourses(),c0=own[0];
  if(LIVE&&c0){try{const d=await LFAPI.j('/learn/'+encodeURIComponent(c0.s));const n=(d.course.modules||[]).length,dn=(d.done||[]).length,pct=n?Math.round(dn/n*100):0;
    const r=document.getElementById('cRing');if(r){r.innerHTML=ring(pct,pct+'%',78);requestAnimationFrame(()=>r.querySelector('.rfg').classList.add('go'))}
    const t=document.getElementById('cTxt');if(t)t.textContent=`${dn} of ${n} lessons completed`;const b=document.getElementById('cBtn');if(b&&n){const nx=(d.done||[]).length<n?[...Array(n).keys()].find(i=>!(d.done||[]).includes(i)):0;b.href=`#watch-${c0.s}/${dn>=n?1:nx+1}`;b.textContent=dn>=n?'Watch again':dn?`Resume lesson ${nx+1}`:'Start lesson 1'}}catch(e){}}
  const box=document.getElementById('topEarn');if(!box)return;let list=[],me=null;
  if(LIVE){try{const r=await LFAPI.j('/leaderboard?range=30d');list=r.top;me=r}catch(e){}}else list=LB.slice(0,5);
  box.innerHTML=list.length?`<ol class="tops">${list.slice(0,5).map((x,i)=>`<li class="${x.me?'me':''}" style="--i:${i}"><span class="rk r${i+1}">${i+1}</span>${avatar(x.n,x.av)}<span class="wn"><b>${esc(x.n)}${x.me?' <em>You</em>':''}</b>${x.em?`<small>${esc(x.em)}</small>`:""}</span><span class="tv">${inr(x.v)}</span><i style="--w:${Math.round(x.v/list[0].v*100)}%"></i></li>`).join('')}</ol>${me&&me.myRank&&me.myRank>5?`<p class="myr">You are <b>#${me.myRank}</b> this month · ${inr(me.myTotal)}</p>`:''}`:`<div class="empty3 sm"><b>No earners yet this month</b><small>Make the first sale and take the #1 spot.</small></div>`};
 /* courses */
 VIEWS.courses=()=>{const own=ownedCourses(),os=own.map(c=>c.s),rest=L.visible().filter(c=>!os.includes(c.s));
  return top('My Courses')+`<div class="mcl">${own.length?own.map((c,i)=>{const th=thumbOf(c),n=(c.modules||[]).length;return `<article class="mcw" style="--i:${i}"><a class="mth" href="#watch-${esc(c.s)}">${th?`<img src="${esc(th)}" alt="" loading="lazy">`:''}<span class="cpl">${I('<path d="M8 5v14l11-7z" fill="currentColor"/>')}</span></a><div class="mbd"><span class="tg2 pu">${esc(c.cat||'Course')}</span><h3>${esc(c.t)}</h3><small class="muted">By ${esc(c.by)} · ${n?n+' lessons':'Lessons coming soon'}</small><div class="mpr"><div class="prog2"><i data-cp="${esc(c.s)}" style="width:0"></i></div><small data-ct="${esc(c.s)}">Not started</small></div><div class="mbt"><a class="btn btn-main" href="#watch-${esc(c.s)}" data-cb="${esc(c.s)}">Start learning</a><a class="btn pill pill-o" href="#course-${esc(c.s)}">Course details</a></div></div></article>`}).join(''):`<div class="empty3">${I(IC.book)}<b>You haven't enrolled in a course yet</b><small>Pick a skill and start today.</small><a class="btn btn-main" href="#courses">Explore skills</a></div>`}</div>
  ${rest.length?`<div class="chd" style="margin-top:8px"><h2 class="sh2" style="margin:0">Explore more skills</h2></div><div class="mc">${rest.map(c=>{const th=thumbOf(c);return `<a class="mcc lkc" href="#course-${esc(c.s)}"><span class="im">${th?`<img src="${esc(th)}" alt="" loading="lazy">`:''}<span class="lkb">${I(IC.lock)}</span></span><span class="bd"><b>${esc(c.t)}</b><small>${c.status==='live'?'Unlock · '+priceTxt(c.price):'Coming soon'}</small></span></a>`}).join('')}</div>`:''}`};
 AFTER.courses=async()=>{if(!LIVE)return;for(const c of ownedCourses()){try{const d=await LFAPI.j('/learn/'+encodeURIComponent(c.s));const n=(d.course.modules||[]).length,dn=(d.done||[]).length,pct=n?Math.round(dn/n*100):0;
   const bar=document.querySelector(`[data-cp="${c.s}"]`),t=document.querySelector(`[data-ct="${c.s}"]`),b=document.querySelector(`[data-cb="${c.s}"]`);
   if(bar)requestAnimationFrame(()=>bar.style.width=pct+'%');if(t)t.textContent=n?`${pct}% complete · ${dn} of ${n} lessons`:'Lessons coming soon';if(b&&dn)b.textContent=pct>=100?'Watch again':'Continue learning'}catch(e){}}};
 /* payouts & wallet */
 VIEWS.payouts=()=>{const tot=PAYOUTS.filter(p=>/paid/i.test(p[3])).reduce((a,p)=>a+p[1],0);
  const tx=[...SALES.slice(0,10).map(s=>({d:s.d,t:'Commission · '+s.name,s:s.course,a:s.amt,st:s.st})),...PAYOUTS.map(p=>({d:p[0],t:'Withdrawal · '+p[2],s:p[3],a:-p[1],st:p[3]}))].sort((a,b)=>b.d-a.d).slice(0,14);
  return top('Payouts & Wallet')+SAMPLE+`<div class="dg">
   <div class="c5">${walletCard(true)}</div>
   <div class="c7 kp3"><div class="kq"><span class="qi">${I(IC.pay)}</span><small>Total paid out</small><b data-cu="${tot}">${inr(tot)}</b><em>${PAYOUTS.length} withdrawals</em></div><div class="kq"><span class="qi">${I(IC.flag)}</span><small>Pending (7-day hold)</small><b data-cu="${ME.pending||0}">${inr(ME.pending||0)}</b><em>Becomes available after 7 days</em></div><div class="kq"><span class="qi">${I(IC.star)}</span><small>Payout day</small><b>Monday</b><em>Every week, to your UPI or bank</em></div></div>
   <section class="cardp c12 wdr"><div class="chd"><div><h2>Request a withdrawal</h2><small class="muted">Minimum ${inr(ME.minPayout||500)} · KYC must be approved</small></div></div>
    <form class="fm wdf" id="wdF" novalidate><label>Amount<span class="rs"><i>₹</i><input type="number" min="${ME.minPayout||500}" max="${ME.bal}" value="${ME.bal||''}" placeholder="0" inputmode="numeric" id="wdA"></span></label><label>Send to<select><option>UPI (from your KYC)</option><option>Bank account (from your KYC)</option></select></label>
     <div class="full chips">${[500,1000,2500].map(v=>`<button type="button" data-amt="${v}" ${v>ME.bal?'disabled':''}>${inr(v)}</button>`).join('')}<button type="button" data-amt="${ME.bal||0}" ${ME.bal?'':'disabled'}>Max</button></div>
     <div class="full"><button class="btn btn-main" type="submit" ${ME.bal>=(ME.minPayout||500)?'':'disabled'}>Request withdrawal</button> <span class="amsg" id="wdM"></span>${ME.bal<(ME.minPayout||500)?`<small class="muted" style="display:block;margin-top:8px">You need at least ${inr(ME.minPayout||500)} available to withdraw. Keep sharing your link!</small>`:''}</div></form></section>
   <section class="cardp c12" id="hist"><div class="chd"><h2>Wallet activity</h2><small class="muted">${tx.length} recent</small></div>${tx.length?`<ul class="txl">${tx.map((x,i)=>`<li style="--i:${i}"><span class="txi ${x.a<0?'out':'in'}">${I(x.a<0?'<path d="M12 5v14M5 12l7 7 7-7"/>':'<path d="M12 19V5M5 12l7-7 7 7"/>')}</span><div><b>${esc(x.t)}</b><small>${dfull(x.d)} · ${esc(x.s)}</small></div>${stTag(x.st)}<span class="txa ${x.a<0?'out':'in'}">${x.a<0?'−':'+'}${inr(Math.abs(x.a))}</span></li>`).join('')}</ul>`:`<div class="empty3">${I(IC.wal)}<b>No wallet activity yet</b><small>Commissions and withdrawals will appear here.</small></div>`}</section>
  </div>`};
 const oldPay=AFTER.payouts;
 AFTER.payouts=()=>{if(oldPay)oldPay();const a=document.getElementById('wdA');document.querySelectorAll('[data-amt]').forEach(b=>b.addEventListener('click',()=>{a.value=b.dataset.amt;document.querySelectorAll('[data-amt]').forEach(x=>x.classList.toggle('on',x===b))}));
  if(location.hash==='#dash-payouts'&&sessionStorage.getItem('lf_hist')){sessionStorage.removeItem('lf_hist');document.getElementById('hist').scrollIntoView({behavior:'smooth'})}};
 document.addEventListener('click',e=>{const h=e.target.closest('[data-scroll="hist"]');if(h)try{sessionStorage.setItem('lf_hist','1')}catch(_){}});
 /* leaderboard */
 if(LIVE){AFTER.leaderboard=()=>{const R=['today','7d','30d','all'],cache={};
  const draw=async k=>{const box=document.getElementById('lbBox');if(!cache[k]){box.innerHTML='<div class="skel tall"></div>';try{cache[k]=await LFAPI.j('/leaderboard?range='+R[k])}catch(e){cache[k]={top:[]}}}
   const d=cache[k],list=d.top||[];if(!list.length){box.innerHTML=`<div class="empty3">${I(IC.trophy)}<b>No sales in this period yet</b><small>Be the first name on the board.</small><a class="btn btn-main" href="#dash-affiliate">Get my link</a></div>`;return}
   const pod=(x,cls,r)=>x?`<div class="${cls}${x.me?' me':''}">${r===1?'<span class="crown">♛</span>':''}${avatar(x.n,x.av,'av4')}<b>${esc(x.n)}${x.me?' · You':''}</b>${x.em?`<span class="pem">${esc(x.em)}</span>`:''}<small>${inr(x.v)}</small><span class="st3"><span>${r}</span></span></div>`:'<div></div>';
   box.innerHTML=`<div class="hof"><span class="orb o1"></span><span class="orb o2"></span><h2>Learnify Hall of Fame</h2><p class="sub">Top earners · ${['today','last 7 days','last 30 days','all time'][k]}</p><div class="pod">${pod(list[1],'p2',2)}${pod(list[0],'p1',1)}${pod(list[2],'p3',3)}</div>${d.myRank?`<p class="myr2">Your rank: <b>#${d.myRank}</b> · ${inr(d.myTotal)}</p>`:`<p class="myr2">You're not on the board yet. One sale gets you in!</p>`}</div>${list.length>3?`<section class="cardp"><ol class="tops big">${list.slice(3).map((x,i)=>`<li class="${x.me?'me':''}" style="--i:${i}"><span class="rk">${i+4}</span>${avatar(x.n,x.av)}<span class="wn"><b>${esc(x.n)}${x.me?' <em>You</em>':''}</b>${x.em?`<small>${esc(x.em)}</small>`:""}</span><span class="tv">${inr(x.v)}</span><i style="--w:${Math.round(x.v/list[0].v*100)}%"></i></li>`).join('')}</ol></section>`:''}`;enter(box)};
  document.querySelectorAll('#lbSeg button').forEach(b=>b.addEventListener('click',()=>{document.querySelectorAll('#lbSeg button').forEach(x=>x.classList.toggle('on',x===b));draw(+b.dataset.k)}));draw(2);document.querySelectorAll('#lbSeg button').forEach(x=>x.classList.toggle('on',x.dataset.k==='2'))}}
}

/* ---------- affiliate + milestones (v3) ---------- */
{
 VIEWS.affiliate=()=>{const link=refUrl(),code=refCode().toUpperCase(),wa='https://wa.me/?text='+encodeURIComponent('Learn a digital skill that pays — live classes + recordings in Hinglish. Join with my link: '+link);
  const sales=SALES.length,earned=SALES.reduce((a,x)=>a+(x.st==='Cancelled'?0:x.amt),0);
  return top('Affiliate Links')+SAMPLE+`<div class="dg">
   <section class="afh c12"><span class="orb o1"></span><span class="orb o2"></span>
    <div class="afl"><small>Your personal link</small><h2>Share once. Earn ${inr(ME.comm||625)} on every sale.</h2>
     <div class="afrow"><code>${esc(link)}</code><button class="btn afc" type="button" data-copy="${esc(link)}">Copy</button></div>
     <div class="afs"><a class="afb wa" href="${esc(wa)}" target="_blank" rel="noopener"><svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm5.3 14.2c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .2-3.3-.7-2.8-1.1-4.6-4-4.7-4.2-.1-.2-1.1-1.5-1.1-2.9s.7-2 1-2.3c.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.8 2c.1.2.1.3 0 .5l-.4.5c-.1.2-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.2 1 2.1 1.3 2.4 1.5.3.1.5.1.7-.1l.9-1.1c.2-.3.4-.2.6-.1l2 .9c.3.1.5.2.5.3.1.2.1.7-.1 1.4z"/></svg>Share on WhatsApp</a><span class="afcd">Code <b>${esc(code)}</b><button type="button" data-copy="${esc(code)}">Copy</button></span></div></div>
    <div class="afst"><div><small>People joined</small><b data-cu="${REFS.length||0}" data-fmt="n">${REFS.length||0}</b></div><div><small>Sales</small><b data-cu="${sales}" data-fmt="n">${sales}</b></div><div><small>Earned</small><b data-cu="${earned}">${inr(earned)}</b></div></div></section>
   <section class="cardp c7"><h2>Link for a specific course</h2><small class="muted" style="margin-top:-8px">Send people straight to the course they want.</small>
    <div class="flt"><label style="flex:1;min-width:200px">Course or package<select id="afSel">${L.visible().map(c=>`<option value="${esc(c.s)}">${esc(c.t)}</option>`).join('')}${packages().map(p=>`<option value="pkg-${esc(p.id)}">${esc(p.t)} package</option>`).join('')}</select></label></div>
    <div class="copyrow"><code id="afOut">${esc(refUrl(L.visible()[0]&&L.visible()[0].s))}</code><button class="btn btn-main" type="button" id="afCopy" style="min-height:44px">Copy link</button></div></section>
   <section class="cardp c5 how"><h2>How you earn</h2><ol class="steps3"><li><i>1</i><div><b>Share your link</b><small>WhatsApp, Instagram, anywhere.</small></div></li><li><i>2</i><div><b>Friend buys a course</b><small>Payment happens on Learnify.</small></div></li><li><i>3</i><div><b>You earn ${inr(ME.comm||625)}</b><small>Available after a 7-day hold, paid every Monday.</small></div></li></ol></section>
   <section class="cardp c12"><div class="chd"><h2>People who joined with your link</h2><small class="muted">${(LIVE?REFS.length:SALES.length)} total</small></div>${(LIVE?REFS:SALES.slice(0,10).map(s=>({name:s.name,d:s.d,av:s.av,em:s.em}))).length?`<ul class="feed">${(LIVE?REFS:SALES.slice(0,10).map(s=>({name:s.name,d:s.d,av:s.av,em:s.em}))).map((r,i)=>{const bought=SALES.find(x=>x.name===r.name);return `<li style="--i:${i}">${avatar(r.name,r.av)}<div><b>${esc(r.name)}</b><small>${r.em?`<span class="eml">${esc(r.em)}</span> · `:''}Joined ${dfull(new Date(r.d))}</small></div>${bought?`<span class="tg2 ok">Bought · ${esc(bought.course)}</span>`:'<span class="tg2 pu">Signed up</span>'}</li>`}).join('')}</ul>`:`<div class="empty3">${I(IC.team)}<b>Nobody has joined yet</b><small>Share your link above — your first referral shows up here.</small></div>`}</section>
  </div>`};
 VIEWS.milestones=()=>{let i=MILES.findIndex(m=>ME.all<m.amt);if(i<0)i=MILES.length;const prev=i?MILES[i-1].amt:0,nx=MILES[Math.min(i,MILES.length-1)];const pct=i>=MILES.length?100:Math.round((ME.all-prev)/(nx.amt-prev)*100);
  const ems=['🎓','👕','🎂','🎧','✈️'];const ms=L.S.missions||[];
  return top('Milestones & Rewards')+SAMPLE+`<div class="dg">
   <section class="msh c12"><span class="orb o1"></span><span class="orb o2"></span><div>${ring(pct,pct+'%',120)}</div><div class="msi"><small>Total earned</small><b data-cu="${ME.all||0}">${inr(ME.all||0)}</b><p>${i>=MILES.length?'You have unlocked every reward. Legend!':`${inr(nx.amt-ME.all)} more to reach <b>${esc(nx.t)}</b> and unlock ${esc(nx.rw.toLowerCase())}.`}</p></div></section>
   <div class="rwg c12">${MILES.map((m,k)=>{const dn=ME.all>=m.amt,cur=k===i;const p=Math.min(100,Math.round(ME.all/m.amt*100));return `<article class="rw ${dn?'dn':cur?'cur':''}" style="--i:${k}"><span class="rwe">${ems[k]||'🏆'}</span><span class="tg2 ${dn?'ok':cur?'pu':'pn'}">${dn?'Unlocked':cur?'In progress':'Locked'}</span><h3>${esc(m.t)}</h3><b class="rwa">${inr(m.amt)}</b><p>${esc(m.rw)}</p><div class="prog2"><i style="width:${p}%"></i></div><small>${dn?'Reward unlocked':p+'% there'}</small></article>`}).join('')}</div>
   <div class="c12"><h2 class="sh2">Missions</h2></div>
   ${ms.length?`<div class="g3 c12">${ms.map((m,k)=>`<article class="mis" style="background:${m.img?`linear-gradient(transparent 30%,rgba(10,7,24,.85)),url('${esc(blob(m.img))}') center/cover`:['linear-gradient(150deg,#14143a,#4b1ff5)','linear-gradient(150deg,#a60eef,#ff0a8c)','linear-gradient(150deg,#ff6a3d,#ffb400)'][k%3]}"><span class="big">${esc(m.target)}<small>sales</small></span><h3>${esc(m.t)}</h3><p>${esc(m.reward)}</p>${m.valid?`<span class="val">Valid: ${esc(m.valid)}</span>`:''}</article>`).join('')}</div>`:`<section class="cardp c12"><div class="empty3">${I(IC.flag)}<b>No missions running right now</b><small>Special sales challenges with extra rewards will appear here.</small></div></section>`}
  </div>`};
 AFTER.milestones=()=>{const r=document.querySelector('.msh .rfg');if(r)requestAnimationFrame(()=>r.classList.add('go'))};
}

/* ---------- profile + team (v4) ---------- */
{
 VIEWS.profile=()=>{const u=user(),own=(LIVE?LFAPI.enrolled():[]).length,since=u.createdAt?new Date(u.createdAt).toLocaleDateString('en-IN',{month:'short',year:'numeric'}):'';
  return top('Profile & Security')+`<div class="dg">
   <section class="pfc c12"><div class="pcv"><span class="orb o1"></span><span class="orb o2"></span><span class="orb o3"></span></div>
    <div class="pbd"><div class="pav">${avatar(u.name,u.avatar,'xl')}<label class="pcam" title="Change photo">${I('<path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.5"/>')}<input type="file" id="avIn" accept="image/*" hidden></label></div>
     <div class="pid"><h2>${esc(u.name)}</h2><p class="pem2">${I('<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>')}<span>${esc(maskE(u.email))}</span><span class="pvt" title="Only the first and last letters are shown to keep your email private">Private</span></p>
      <div class="pch"><span class="pk">${esc(ME.pkg)} plan</span>${since?`<span class="pcp">Member since ${esc(since)}</span>`:''}${u.city?`<span class="pcp">📍 ${esc(u.city)}</span>`:''}</div></div>
     <div class="pact">${u.avatar?`<button type="button" class="btn pill pill-o" id="avRm">Remove photo</button>`:''}<label class="btn btn-main" for="avIn">${u.avatar?'Change photo':'Upload photo'}</label></div></div>
    <div class="pst"><div><b data-cu="${own}" data-fmt="n">${own}</b><small>Courses</small></div><div><b data-cu="${ME.all||0}">${inr(ME.all||0)}</b><small>Total earned</small></div><div><b data-cu="${(REFS||[]).length}" data-fmt="n">${(REFS||[]).length}</b><small>People referred</small></div><div><b class="pcode">${esc(refCode().toUpperCase())}</b><small>Referral code</small></div></div>
    <p class="amsg" id="avM" style="padding:0 28px 18px"></p></section>
   <section class="cardp c7"><h2>Personal details</h2><form class="fm" id="pfF" novalidate><label>Full name<input value="${esc(u.name)}" autocomplete="name"></label><label>Email<input type="email" value="${esc(u.email)}"></label><label>WhatsApp number<input inputmode="tel" placeholder="10-digit number" autocomplete="tel"></label><label>City<input placeholder="Your city"></label><label class="full">About you<textarea placeholder="Student, freelancer, business owner…"></textarea></label><div class="full"><button class="btn btn-main" type="submit">Save changes</button> <span class="amsg" id="pfM"></span></div></form></section>
   <section class="cardp c5"><h2>Password</h2><small class="muted" style="margin-top:-8px">Changing it signs you out of other devices.</small><form class="fm one" id="scF" novalidate><label>Current password<input type="password" autocomplete="current-password"></label><label>New password<input type="password" autocomplete="new-password" minlength="8"></label><label>Confirm new password<input type="password" autocomplete="new-password"></label><div><button class="btn btn-main" type="submit">Update password</button> <span class="amsg" id="scM"></span></div></form>
    <div class="secn">${I('<path d="M12 3l8 4v5c0 5-3.5 8-8 9-4.5-1-8-4-8-9V7z"/><path d="M9 12l2 2 4-4"/>')}<span><b>One device at a time</b><small>Logging in somewhere new signs out the old device, so your account can't be shared.</small></span></div></section>
  </div>`};
 const oldProf=AFTER.profile;
 AFTER.profile=()=>{if(oldProf)oldProf();const inp=document.getElementById('avIn'),msg=document.getElementById('avM');if(!inp)return;
  const done=async()=>{if(LIVE)await LFAPI.reloadMe();window.LFApp.reset();show('dash-profile')};
  inp.addEventListener('change',async()=>{const f=inp.files&&inp.files[0];if(!f)return;if(!LIVE){msg.textContent='Photo upload works on the live site.';return}
   msg.textContent='Uploading…';msg.className='amsg';
   try{const data=await squareWebp(f,320);await LFAPI.j('/me/avatar',{method:'POST',body:JSON.stringify({data})});await done()}catch(e){msg.textContent=e.message||'Could not upload the photo';msg.className='amsg err'}});
  const rm=document.getElementById('avRm');if(rm)rm.addEventListener('click',async()=>{try{await LFAPI.j('/me/avatar',{method:'DELETE'});await done()}catch(e){msg.textContent=e.message;msg.className='amsg err'}})};
 function squareWebp(file,size){return new Promise((res,rej)=>{const img=new Image(),url=URL.createObjectURL(file);img.onload=()=>{const c=document.createElement('canvas');c.width=c.height=size;const s=Math.min(img.width,img.height),x=(img.width-s)/2,y=(img.height-s)/2;c.getContext('2d').drawImage(img,x,y,s,s,0,0,size,size);URL.revokeObjectURL(url);let d=c.toDataURL('image/webp',.85);if(!d.startsWith('data:image/webp'))d=c.toDataURL('image/jpeg',.85);res(d)};img.onerror=()=>rej(new Error('That file is not a photo we can read'));img.src=url})}
 /* team */
 VIEWS.team=()=>{const tot=SALES.filter(x=>x.st!=='Cancelled').reduce((a,x)=>a+x.amt,0),st=['All','Pending','Approved','Paid'];
  return top('My Team')+SAMPLE+`<div class="dg">
   <div class="c12 kp3"><div class="kq"><span class="qi">${I(IC.team)}</span><small>People joined</small><b data-cu="${LIVE?REFS.length:NAMES.length}" data-fmt="n">${LIVE?REFS.length:NAMES.length}</b><em>Signed up with your link</em></div><div class="kq"><span class="qi">${I(IC.pay)}</span><small>Team purchases</small><b data-cu="${SALES.length}" data-fmt="n">${SALES.length}</b><em>Courses bought through you</em></div><div class="kq"><span class="qi">${I(IC.wal)}</span><small>Commission earned</small><b data-cu="${tot}">${inr(tot)}</b><em>${inr(ME.comm||625)} per sale</em></div></div>
   <section class="cardp c12"><div class="chd"><h2>Team purchases</h2><div class="tbar"><label class="srch">${I('<circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/>')}<input id="tmQ" type="search" placeholder="Search name or course"></label><div class="seg" id="tmS">${st.map((x,i)=>`<button type="button" class="${i?'':'on'}" data-s="${x}">${x}</button>`).join('')}</div></div></div>
    ${SALES.length?`<ul class="txl tml" id="tmL">${SALES.map((x,i)=>`<li style="--i:${Math.min(i,12)}" data-q="${esc((x.name+' '+x.course).toLowerCase())}" data-s="${esc(x.st)}">${who(x.name,x.em,x.av)}<div class="tmc"><b>${esc(x.course)}</b><small>${dfull(x.d)}</small></div>${stTag(x.st)}<span class="txa in">+${inr(x.amt)}</span></li>`).join('')}</ul><div class="empty3 sm" id="tmE" hidden><b>No matches</b><small>Try another name or filter.</small></div>`:`<div class="empty3">${I(IC.team)}<b>No team purchases yet</b><small>When someone buys a course with your link, they appear here.</small><a class="btn btn-main" href="#dash-affiliate">Get my link</a></div>`}</section>
   ${LIVE&&REFS.length?`<section class="cardp c12"><div class="chd"><h2>People who joined</h2><small class="muted">${REFS.length} total</small></div><div class="pgrid">${REFS.map((r,i)=>`<div class="tmcard" style="--i:${Math.min(i,12)}">${avatar(r.name,r.av,'lg')}<b>${esc(r.name)}</b><small>${esc(r.em||'')}</small><span>Joined ${dfull(new Date(r.d))}</span></div>`).join('')}</div></section>`:''}
  </div>`};
 AFTER.team=()=>{const q=document.getElementById('tmQ'),L2=document.getElementById('tmL');if(!q||!L2)return;let f='All';
  const run=()=>{const t=q.value.trim().toLowerCase();let n=0;L2.querySelectorAll('li').forEach(li=>{const ok=(!t||li.dataset.q.includes(t))&&(f==='All'||li.dataset.s===f);li.hidden=!ok;if(ok)n++});document.getElementById('tmE').hidden=!!n};
  q.addEventListener('input',run);document.querySelectorAll('#tmS button').forEach(b=>b.addEventListener('click',()=>{f=b.dataset.s;document.querySelectorAll('#tmS button').forEach(x=>x.classList.toggle('on',x===b));run()}))};
}

/* ---------- v5: notifications, certificates, admin analytics ---------- */
{
 const ICN={sale:'<path d="M12 19V5M5 12l7-7 7 7"/>',payout:'<rect x="2" y="6" width="20" height="13" rx="2"/><path d="M2 10h20"/>',check:'<path d="M5 12.5l4.5 4.5L19 7.5"/>'};
 /* ---- notifications: bell panel + live toasts ---- */
 let NT={items:[],seen:0,since:null,timer:null,open:false};
 try{NT.seen=+localStorage.getItem('lf_seen')||0}catch(e){}
 const unread=()=>NT.items.filter(x=>new Date(x.d).getTime()>NT.seen).length;
 function badge(){const n=unread(),b=document.getElementById('bellN');if(b){b.hidden=!n;b.textContent=n>9?'9+':n}}
 function stack(){let s=document.getElementById('lfStack');if(!s){s=document.createElement('div');s.id='lfStack';s.setAttribute('aria-live','polite');document.body.appendChild(s)}return s}
 function toast2(it){const el=document.createElement('div');el.className='lft';el.innerHTML=`<span class="nti">${I(ICN[it.t]||ICN.sale)}</span><div><b>${esc(it.title)}</b><small>${esc(it.body)}</small></div>`;stack().appendChild(el);setTimeout(()=>{el.classList.add('out');setTimeout(()=>el.remove(),300)},5200)}
 function panel(){const sp=document.querySelector('#mainp .ptop .sp');if(!sp)return;let p=document.getElementById('ntp');if(p){p.remove();NT.open=false;return}
  p=document.createElement('div');p.id='ntp';p.className='ntp';p.setAttribute('role','dialog');p.setAttribute('aria-label','Notifications');
  p.innerHTML=`<header><b>Notifications</b>${NT.items.length?'<button type="button" id="ntAll">Mark all as read</button>':''}</header>${NT.items.length?`<ul>${NT.items.slice(0,20).map(x=>`<li class="${new Date(x.d).getTime()>NT.seen?'new':''}"><span class="nti ${x.t}">${I(ICN[x.t]||ICN.sale)}</span><div><b>${esc(x.title)}</b><small>${esc(x.body)}</small><time>${agoTxt(new Date(x.d))}</time></div></li>`).join('')}</ul>`:`<div class="ntx">You're all caught up.<br>New sales and payouts show up here.</div>`}<footer><a href="#dash-notifications">View all activity</a></footer>`;
  sp.appendChild(p);NT.open=true;const a=document.getElementById('ntAll');if(a)a.addEventListener('click',markRead);
  setTimeout(()=>document.addEventListener('click',function off(e){if(!e.target.closest('#ntp,#bellB')){const q=document.getElementById('ntp');if(q)q.remove();NT.open=false;document.removeEventListener('click',off)}}),0)}
 function markRead(){NT.seen=Date.now();try{localStorage.setItem('lf_seen',NT.seen)}catch(e){}badge();const p=document.getElementById('ntp');if(p)p.querySelectorAll('li.new').forEach(l=>l.classList.remove('new'))}
 async function poll(first){if(!LIVE||!L.getUser())return;if(document.hidden&&!first)return;
  try{const since=NT.since||new Date(Date.now()-14*864e5).toISOString();const r=await LFAPI.j('/pulse?since='+encodeURIComponent(since));NT.since=r.now;
   if(r.items.length){const fresh=r.items.filter(x=>!NT.items.some(y=>y.d===x.d&&y.title===x.title));NT.items=[...fresh,...NT.items].slice(0,60);
    if(!first){fresh.slice(0,3).forEach((x,i)=>setTimeout(()=>toast2(x),i*400));liveLoaded=false;if(L.curPage()==='dashboard'&&/^(dashboard|dash-payouts|dash-team)$/.test(location.hash.slice(1)||'dashboard'))setTimeout(()=>show(current),900)}}
   badge()}catch(e){}}
 function startPoll(){if(NT.timer||!LIVE)return;poll(true);NT.timer=setInterval(()=>poll(false),45000);document.addEventListener('visibilitychange',()=>{if(!document.hidden)poll(false)})}
 document.addEventListener('click',e=>{const b=e.target.closest('#bellB');if(b){e.preventDefault();panel();markRead()}});
 const _show=show;
 window.__lfAfterShow=()=>{startPoll();badge()};
 /* ---- certificates ---- */
 VIEWS.certificates=()=>{const own=LIVE?L.visible().filter(c=>LFAPI.enrolled().includes(c.s)):L.visible().slice(0,1);
  return top('Certificates')+`<div class="dg">${own.length?own.map((c,i)=>`<section class="cardp c6 crt" style="--i:${i}" data-cs="${esc(c.s)}"><div class="crh"><span class="rwi">${I(IC.cert)}</span><div><b>${esc(c.t)}</b><small class="muted">Certificate of completion</small></div><span class="tg2 pn" data-cst>Checking…</span></div><div class="prog2"><i data-cpb style="width:0"></i></div><div class="crf"><small class="muted" data-ctx>Loading progress…</small><button type="button" class="btn btn-main" data-cert="${esc(c.s)}" disabled>View certificate</button></div></section>`).join(''):`<section class="cardp c12"><div class="empty3">${I(IC.cert)}<b>No certificates yet</b><small>Enrol in a skill and finish every lesson to earn a verified certificate.</small><a class="btn btn-main" href="#courses">Explore skills</a></div></section>`}</div>`};
 AFTER.certificates=async()=>{for(const card of document.querySelectorAll('[data-cs]')){const s=card.dataset.cs;try{const r=LIVE?await LFAPI.j('/certificate/'+encodeURIComponent(s)):{ready:false,done:0,total:0};
   const st=card.querySelector('[data-cst]'),bar=card.querySelector('[data-cpb]'),tx=card.querySelector('[data-ctx]'),b=card.querySelector('[data-cert]');
   if(r.ready){st.className='tg2 ok';st.textContent='Earned';bar.style.width='100%';tx.textContent='Issued '+dfull(new Date(r.issuedAt))+' · ID '+r.id;b.disabled=false;b.onclick=()=>openCert(r)}
   else{const p=r.total?Math.round(r.done/r.total*100):0;st.className='tg2 pu';st.textContent=p+'% complete';requestAnimationFrame(()=>bar.style.width=p+'%');tx.textContent=r.total?`${r.done} of ${r.total} lessons done · finish all to unlock`:'Lessons coming soon';b.textContent='Continue course';b.disabled=false;b.onclick=()=>location.hash='#watch-'+s}}catch(e){}}};
 function openCert(r){const ov=document.createElement('div');ov.className='certov';const url=location.origin+'/#verify-'+r.id;
  ov.innerHTML=`<div class="certbar"><button type="button" class="pr" id="cPr">Download PDF</button><button type="button" id="cX">Close</button></div>
  <div class="cert3"><div class="cfr"></div><div class="cin"><div class="ctop"><img src="logo.webp" alt="Learnify"><div class="cid">Certificate ID ${esc(r.id)}<br>Verify at ${esc(url.replace(/^https?:\/\//,''))}</div></div>
   <div class="ckick">Certificate of completion</div><div class="cttl">${esc(r.course)}</div>
   <div class="cpres">This certifies that</div><div class="cname">${avatar(r.name,r.avatar)}<h2>${esc(r.name)}</h2></div>
   <p class="cfor">has successfully completed all <b>${r.lessons} lessons</b> of the <b>${esc(r.course)}</b> programme at Learnify, including recorded lessons, live sessions and practical assignments.</p>
   <div class="cbot"><div class="csig"><i>${esc(r.mentor)}</i><span>Mentor, Learnify</span></div><div class="csig"><i>${new Date(r.issuedAt).toLocaleDateString('en-IN',{day:'numeric',month:'long',year:'numeric'})}</i><span>Date of issue</span></div><div class="cseal"><div><b>L</b>VERIFIED<br>LEARNIFY</div></div></div></div></div>`;
  document.body.appendChild(ov);document.getElementById('cX').onclick=()=>ov.remove();document.getElementById('cPr').onclick=()=>window.print();ov.addEventListener('click',e=>{if(e.target===ov)ov.remove()})}
 /* ---- public certificate check ---- */
 async function verify(id){const r=document.getElementById('verifyRoot');if(!r)return;r.innerHTML='<div class="vbox"><p class="muted">Checking certificate…</p></div>';
  let d={valid:false};try{const x=await fetch('/api/verify/'+encodeURIComponent(id));d=await x.json()}catch(e){}
  r.innerHTML=d.valid?`<div class="vbox ok"><span class="vic">${I(ICN.check)}</span><small>Verified certificate</small><h1>${esc(d.name)}</h1><p>completed <b>${esc(d.course)}</b> at Learnify on ${new Date(d.issuedAt).toLocaleDateString('en-IN',{day:'numeric',month:'long',year:'numeric'})}.</p><code>${esc(d.id)}</code></div>`:`<div class="vbox"><span class="vic no">!</span><small>Not found</small><h1>We couldn't verify this certificate</h1><p>Check the ID and try again, or contact Learnify.</p><code>${esc(id)}</code></div>`}
 /* ---- milestone icons instead of emoji ---- */
 const RWI=['<path d="M22 10L12 5 2 10l10 5 10-5z"/><path d="M6 12v5c3 2 9 2 12 0v-5"/>','<path d="M8 3l-4 3 2 4 2-1v12h8V9l2 1 2-4-4-3c-1 1.5-2.5 2-4 2s-3-.5-4-2z"/>','<path d="M4 21h16M5 21V12h14v9M12 12V8M12 5v.01M8 12V9M16 12V9"/>','<path d="M3 14v-2a9 9 0 0 1 18 0v2"/><rect x="2" y="14" width="5" height="7" rx="1.5"/><rect x="17" y="14" width="5" height="7" rx="1.5"/>','<path d="M2 16l20-8-4 12-6-4-4 4v-6z"/>'];
 const _ms=VIEWS.milestones;VIEWS.milestones=()=>{const ems=['🎓','👕','🎂','🎧','✈️'];let h=_ms();ems.forEach((e,i)=>{h=h.replace(`<span class="rwe">${e}</span>`,`<span class="rwi">${I(RWI[i])}</span>`)});return h};
 /* ---- admin ---- */
 const tagS=s=>`<span class="tag3 ${/paid|approved/.test(s)?'ok':/pending|submitted|created/.test(s)?'pn':/reject|cancel|refund/.test(s)?'no':''}">${esc(s)}</span>`;
 const needLive=b=>{b.innerHTML='<div class="empty2">This section works on the live site, where real orders and students are stored.</div>'};
 ADMIN.overview=async box=>{if(!LIVE)return needLive(box);box.innerHTML='<div class="skel tall"></div>';let d;try{d=await LFAPI.j('/admin/overview')}catch(e){box.innerHTML=`<div class="empty2">${esc(e.message)}</div>`;return}
  const ch=d.revPrev30?Math.round((d.rev30-d.revPrev30)/d.revPrev30*100):null,mx=Math.max(1,...d.byCourse.map(x=>x.v));
  const ser=d.series.map(x=>({l:new Date(x.d).toLocaleDateString('en-IN',{day:'numeric',month:'short'}),v:x.v}));
  box.innerHTML=`<div class="adm-ov">
   ${d.pendingPayouts||d.pendingKyc?`<div class="alert3 c12">${I(IC.bell)}<span>${d.pendingPayouts?`${d.pendingPayouts} payout request${d.pendingPayouts>1?'s':''} waiting`:''}${d.pendingPayouts&&d.pendingKyc?' · ':''}${d.pendingKyc?`${d.pendingKyc} KYC to review`:''}</span><a href="#admin" data-go="${d.pendingPayouts?'payouts':'kycs'}">Review now →</a></div>`:''}
   <div class="kpx"><small>Revenue · last 30 days</small><b>${inr(d.rev30)}</b><em class="${ch==null?'':ch>=0?'up':'dn'}">${ch==null?'First month':(ch>=0?'▲ ':'▼ ')+Math.abs(ch)+'% vs previous 30 days'}</em></div>
   <div class="kpx"><small>Total revenue</small><b>${inr(d.revenue)}</b><em>${d.sales} paid orders · ${inr(d.today)} today</em></div>
   <div class="kpx"><small>Students</small><b>${d.students.toLocaleString('en-IN')}</b><em>+${d.newStudents} in the last 30 days</em></div>
   <div class="kpx"><small>Affiliate commission</small><b>${inr(d.commission)}</b><em>${d.revenue?Math.round(d.commission/d.revenue*100):0}% of revenue</em></div>
   <section class="cardp c8"><div class="chd"><h2>Revenue · 30 days</h2><small class="muted">${inr(d.rev30)}</small></div>${areaChart(ser.filter((_,i)=>i%1===0),{h:240,id:'arv'}).replace(/<div class="axl">[\s\S]*?<\/div>/,`<div class="axl">${ser.filter((_,i)=>i%5===0||i===29).map(x=>`<span>${x.l}</span>`).join('')}</div>`)}</section>
   <section class="cardp c4"><h2>Revenue by course</h2>${d.byCourse.length?`<div class="cbar">${d.byCourse.map(x=>`<div><span><b>${esc(x.t)}</b><em>${inr(x.v)}</em></span><i><b style="width:${Math.round(x.v/mx*100)}%"></b></i></div>`).join('')}</div>`:'<div class="empty3 sm"><b>No sales yet</b></div>'}</section>
   <section class="cardp c6"><div class="chd"><h2>Latest orders</h2><a class="mut2" href="#admin" data-go="orders">All orders</a></div>${d.recent.length?d.recent.map(o=>`<div class="arow">${who(o.n,o.em,o.av)}<span class="meta">${agoTxt(new Date(o.d))}</span><span class="amt3">${inr(o.amount)}</span></div>`).join(''):'<div class="empty3 sm"><b>No orders yet</b></div>'}</section>
   <section class="cardp c6"><h2>Top affiliates</h2>${d.topAffiliates.length?d.topAffiliates.map((x,i)=>`<div class="arow"><span class="rk r${i+1}">${i+1}</span>${who(x.n,x.em,x.av)}<span class="amt3">${inr(x.v)}</span></div>`).join(''):'<div class="empty3 sm"><b>No affiliate sales yet</b></div>'}</section>
  </div>`;goLinks(box)};
 function goLinks(box){box.querySelectorAll('[data-go]').forEach(a=>a.addEventListener('click',e=>{e.preventDefault();document.querySelector(`.atabs button[data-t="${a.dataset.go}"]`).click()}))}
 ADMIN.orders=async box=>{if(!LIVE)return needLive(box);box.innerHTML='<div class="skel tall"></div>';const d=await LFAPI.j('/admin/orders');const os=d.orders;
  const draw=q=>{const f=os.filter(o=>!q||(o.name+' '+o.email+' '+o.title+' '+o.paymentId).toLowerCase().includes(q));return f.length?f.map(o=>`<div class="arow">${who(o.name,o.email,'')}<span class="meta" style="flex:1">${esc(o.title)}</span><span class="meta">${dfull(new Date(o.d))}</span>${tagS(o.status)}<span class="amt3">${inr(o.amount)}</span></div>`).join(''):'<div class="empty3 sm"><b>No orders found</b></div>'};
  const paid=os.filter(o=>o.status==='paid');
  box.innerHTML=`<section class="cardp"><div class="atl"><h2>Orders <small class="muted">${paid.length} paid · ${inr(paid.reduce((a,o)=>a+o.amount,0))}</small></h2><input type="search" id="aoQ" placeholder="Search name, email, course or payment ID"></div><div id="aoL">${draw('')}</div></section>`;
  document.getElementById('aoQ').addEventListener('input',e=>{document.getElementById('aoL').innerHTML=draw(e.target.value.trim().toLowerCase())})};
 ADMIN.students=async box=>{if(!LIVE)return needLive(box);box.innerHTML='<div class="skel tall"></div>';const d=await LFAPI.j('/admin/students');const cs=L.visible();
  const draw=q=>{const f=d.students.filter(u=>!q||(u.name+' '+u.email+' '+u.phone).toLowerCase().includes(q));return f.map(u=>`<div class="arow">${who(u.name,u.email,u.avatar)}<span class="meta">${esc(u.phone||'—')}</span><span class="meta" style="flex:1;text-align:right">${u.courses.length?u.courses.map(s=>`<span class="tag3 ok">${esc((cs.find(c=>c.s===s)||{t:s}).t)}</span>`).join(' '):'<span class="tag3">No course</span>'}</span>${u.role==='admin'?'<span class="tag3 pn">Admin</span>':''}</div>`).join('')||'<div class="empty3 sm"><b>No students found</b></div>'};
  box.innerHTML=`<div class="adm-ov"><section class="cardp c8"><div class="atl"><h2>Students <small class="muted">${d.students.length}</small></h2><input type="search" id="asQ" placeholder="Search name, email or phone"></div><div id="asL">${draw('')}</div></section>
   <section class="cardp c4"><h2>Give or remove access</h2><small class="muted" style="margin-top:-8px">For cash/UPI payments taken outside the site.</small><form class="fm one" id="aeF" novalidate><label>Student email<input type="email" required placeholder="student@gmail.com"></label><label>Course<select>${cs.map(c=>`<option value="${esc(c.s)}">${esc(c.t)}</option>`).join('')}</select></label><label>Action<select><option value="add">Give access</option><option value="remove">Remove access</option></select></label><div><button class="btn btn-main" type="submit">Save</button> <span class="amsg" id="aeM"></span></div></form></section></div>`;
  document.getElementById('asQ').addEventListener('input',e=>{document.getElementById('asL').innerHTML=draw(e.target.value.trim().toLowerCase())});
  const f=document.getElementById('aeF');f.addEventListener('submit',async e=>{e.preventDefault();const [em,sl,ac]=[...f.querySelectorAll('input,select')].map(x=>x.value.trim());const m=document.getElementById('aeM');try{await LFAPI.j('/admin/enroll',{method:'POST',body:JSON.stringify({email:em,slug:sl,action:ac})});m.textContent='Saved.';m.className='amsg ok';setTimeout(()=>ADMIN.students(box),800)}catch(err){m.textContent=err.message;m.className='amsg err'}})};
 ADMIN.payouts=async box=>{if(!LIVE)return needLive(box);box.innerHTML='<div class="skel tall"></div>';const d=await LFAPI.j('/admin/payouts');const pend=d.payouts.filter(p=>p.status==='pending'),rest=d.payouts.filter(p=>p.status!=='pending');
  const row=(p,act)=>`<div class="arow" data-pid="${esc(p.id)}">${who(p.name,p.method==='bank'?`${p.account||'—'} · ${p.ifsc||''}`:(p.upi||'No UPI in KYC'),'')}<span class="meta">${dfull(new Date(p.d))} · ${p.method==='bank'?'Bank':'UPI'}</span><span class="amt3">${inr(p.amount)}</span>${act?`<span class="bs"><button type="button" class="ok" data-ps="paid">Mark paid</button><button type="button" class="no" data-ps="rejected">Reject</button></span>`:tagS(p.status)}</div>`;
  box.innerHTML=`<div class="adm-ov"><section class="cardp c12"><div class="chd"><h2>Waiting for payment <small class="muted">${pend.length} · ${inr(pend.reduce((a,p)=>a+p.amount,0))}</small></h2></div><small class="muted" style="margin-top:-6px">Send the money from your bank or UPI app first, then press “Mark paid”. The student is notified instantly.</small>${pend.length?pend.map(p=>row(p,1)).join(''):'<div class="empty3 sm"><b>No pending requests</b><small>New withdrawal requests appear here.</small></div>'}</section>
   <section class="cardp c12"><h2>History</h2>${rest.length?rest.map(p=>row(p,0)).join(''):'<div class="empty3 sm"><b>No payouts yet</b></div>'}</section></div>`;
  box.querySelectorAll('[data-ps]').forEach(b=>b.addEventListener('click',async()=>{const id=b.closest('[data-pid]').dataset.pid;const st=b.dataset.ps;let note='';if(st==='rejected'){note=prompt('Reason for rejecting (the student will see this):','Please update your KYC details')||'';}b.disabled=true;try{await LFAPI.j('/admin/payouts/'+encodeURIComponent(id),{method:'POST',body:JSON.stringify({status:st,note})});ADMIN.payouts(box)}catch(e){b.disabled=false;alert(e.message)}}))};
 ADMIN.kycs=async box=>{if(!LIVE)return needLive(box);box.innerHTML='<div class="skel tall"></div>';const d=await LFAPI.j('/admin/kyc');
  box.innerHTML=`<section class="cardp"><h2>KYC submissions <small class="muted">${d.kyc.filter(k=>k.status==='submitted').length} waiting</small></h2>${d.kyc.length?d.kyc.map(k=>`<div class="arow" data-kid="${esc(k.id)}">${who(k.name,'PAN '+(k.pan||'—'),'')}<span class="meta" style="flex:1">${esc(k.upi||'')}${k.account?` · A/c ${esc(k.account)} · ${esc(k.ifsc||'')}`:''}</span>${k.status==='submitted'?`<span class="bs"><button type="button" class="ok" data-ks="approved">Approve</button><button type="button" class="no" data-ks="rejected">Reject</button></span>`:tagS(k.status)}</div>`).join(''):'<div class="empty3 sm"><b>No KYC submissions yet</b></div>'}</section>`;
  box.querySelectorAll('[data-ks]').forEach(b=>b.addEventListener('click',async()=>{const id=b.closest('[data-kid]').dataset.kid,st=b.dataset.ks;let note='';if(st==='rejected')note=prompt('Reason (the student will see this):','PAN details do not match')||'';b.disabled=true;try{await LFAPI.j('/admin/kyc/'+encodeURIComponent(id),{method:'POST',body:JSON.stringify({status:st,note})});ADMIN.kycs(box)}catch(e){b.disabled=false;alert(e.message)}}))};
 window.__lfVerify=verify;
}

window.LFApp={show,verify:id=>window.__lfVerify&&window.__lfVerify(id),page(p){if(p==='packages')renderPackages();if(p==='jobs')renderJobs()},admin:ADMIN,reset(){const r=document.getElementById('app');if(r){r.innerHTML='';delete r.dataset.ready}}};
plansHome();
L.route();
}
