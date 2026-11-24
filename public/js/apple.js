{
const RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
/* reveal */
const io='IntersectionObserver' in window&&!RM?new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.15,rootMargin:'0px 0px -60px 0px'}):null;
function arm(){document.querySelectorAll('.ar:not([data-a])').forEach(el=>{el.dataset.a=1;const sib=[...el.parentElement.children].filter(c=>c.classList.contains('ar'));el.style.setProperty('--rd',Math.min(sib.indexOf(el),5)*.08+'s');if(io)io.observe(el);else el.classList.add('in')})}
arm();addEventListener('hashchange',()=>setTimeout(arm,50));
/* hero stage grows as you scroll */
const st=document.getElementById('astage');
let tick=false;
function frame(){tick=false;if(!st||!st.offsetParent)return;const r=st.getBoundingClientRect(),vh=innerHeight;const p=Math.min(1,Math.max(0,(vh-r.top)/(vh*.9)));st.style.transform=`scale(${(.9+.1*p).toFixed(4)})`;st.style.borderRadius=(36-12*p).toFixed(1)+'px'}
if(st&&!RM){addEventListener('scroll',()=>{if(!tick){tick=true;requestAnimationFrame(frame)}},{passive:true});frame()}
/* sticky steps */
const items=[...document.querySelectorAll('.s4list li')],n=document.getElementById('s4n'),l=document.getElementById('s4l'),b=document.getElementById('s4b');
const labels=['Learn live','Practise','Build a portfolio','Start earning'];
function setStep(i){items.forEach((x,k)=>x.classList.toggle('on',k===i));if(n){n.style.opacity=0;setTimeout(()=>{n.textContent=i+1;l.textContent=labels[i];n.style.opacity=1},180);b.style.width=((i+1)*25)+'%'}}
if(items.length){if('IntersectionObserver' in window){const so=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)setStep(items.indexOf(e.target))}),{rootMargin:'-45% 0px -45% 0px'});items.forEach(x=>so.observe(x))}setStep(0)}
/* course rail arrows */
document.querySelectorAll('.rbtn').forEach(btn=>btn.addEventListener('click',()=>{const r=document.getElementById('homeGrid');const c=r.firstElementChild;const w=c?c.getBoundingClientRect().width+20:320;r.scrollBy({left:w*(+btn.dataset.dir),behavior:RM?'auto':'smooth'})}));
}
{
const RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
/* count-up stats */
const cs=document.querySelectorAll('[data-count]');
if(cs.length&&'IntersectionObserver' in window&&!RM){const co=new IntersectionObserver(es=>es.forEach(e=>{if(!e.isIntersecting)return;co.unobserve(e.target);const el=e.target,t=+el.dataset.count,pre=el.dataset.pre||'',t0=performance.now(),d=1400;
 const step=n=>{const k=Math.min(1,(n-t0)/d),v=Math.round(t*(1-Math.pow(1-k,4)));el.textContent=pre+v.toLocaleString('en-IN');if(k<1)requestAnimationFrame(step)};step(t0)}),{threshold:.6});cs.forEach(c=>co.observe(c))}
/* hero image parallax inside the stage */
const g=document.querySelector('.agirl'),st=document.getElementById('astage');
if(g&&st&&!RM){let t=false;const f=()=>{t=false;const r=st.getBoundingClientRect();if(r.bottom<0||r.top>innerHeight)return;const p=Math.max(-1,Math.min(1,r.top/innerHeight));g.style.translate=`0 ${(p*-24).toFixed(1)}px`};addEventListener('scroll',()=>{if(!t){t=true;requestAnimationFrame(f)}},{passive:true})}
}
