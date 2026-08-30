// ================================================================
//  LOADER
// ================================================================
const ldr=document.getElementById('ldr'),lpct=document.getElementById('lpct');
let lv2=0;
const lvi=setInterval(()=>{lv2=Math.min(lv2+Math.random()*14,99);lpct.textContent=Math.floor(lv2)+'%';if(lv2>=99)clearInterval(lvi);},110);
setTimeout(()=>{lpct.textContent='100%';ldr.classList.add('out');},2400);

// Cursor removed — using default browser cursor

// ================================================================
//  SCROLL BAR + RIPPLE
// ================================================================
window.addEventListener('scroll',()=>{const sc=document.documentElement.scrollHeight-window.innerHeight;document.getElementById('sb').style.width=(window.scrollY/sc*100)+'%';});
document.addEventListener('click',e=>{const btn=e.target.closest('.s-btn,.t-btn,.cta-btn,.t-tab,.pm-btn,.hd-btn,.r-btn,.cf-submit,.gw-btn,.f-si,#music-btn');if(btn){const cs=getComputedStyle(btn);if(cs.position==='static')btn.style.position='relative';const r=document.createElement('span');r.className='ripple';const rect=btn.getBoundingClientRect(),size=Math.max(rect.width,rect.height);r.style.cssText='width:'+size+'px;height:'+size+'px;left:'+(e.clientX-rect.left-size/2)+'px;top:'+(e.clientY-rect.top-size/2)+'px;';btn.appendChild(r);setTimeout(()=>r.remove(),620);}});

function pulseBtn(el){if(!el)return;el.classList.add('btn-ok');setTimeout(()=>el.classList.remove('btn-ok'),560);}
const canHover=window.matchMedia('(hover:hover) and (pointer:fine)').matches;
if(canHover){
document.addEventListener('pointermove',e=>{
  const b=e.target.closest('.cta-btn,.gw-btn,.cf-submit');
  if(!b||window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  const r=b.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;
  b.style.transform='translate('+(x*6)+'px,'+(y*5-2)+'px) scale(1.03)';
},{passive:true});
document.addEventListener('pointerleave',e=>{
  const b=e.target.closest('.cta-btn,.gw-btn,.cf-submit');
  if(b)b.style.transform='';
},true);
}

// ================================================================
//  THREE.JS BACKGROUND — denser stars
// ================================================================
(()=>{
  const c=document.getElementById('bgc');
  if(!c||!window.THREE)return;
  const renderer=new THREE.WebGLRenderer({canvas:c,alpha:true,antialias:true});
  renderer.setPixelRatio(Math.min(devicePixelRatio,2));
  renderer.setSize(innerWidth,innerHeight);
  const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(60,innerWidth/innerHeight,.1,1000);
  camera.position.z=28;
  function hex(){const s=getComputedStyle(document.body).getPropertyValue('--p').trim()||'#7cf0ff';return parseInt(s.replace('#','').slice(0,6).padEnd(6,'0'),16)||0x7cf0ff;}
  const N=innerWidth<700?420:900,pos=new Float32Array(N*3);
  for(let i=0;i<N*3;i++)pos[i]=(Math.random()-.5)*120;
  const geo=new THREE.BufferGeometry();
  geo.setAttribute('position',new THREE.BufferAttribute(pos,3));
  const mat=new THREE.PointsMaterial({color:hex(),size:innerWidth<700?.22:.18,transparent:true,opacity:.85,sizeAttenuation:true});
  const pts=new THREE.Points(geo,mat);scene.add(pts);
  const geo2=new THREE.BufferGeometry(),N2=Math.floor(N*.35),pos2=new Float32Array(N2*3);
  for(let i=0;i<N2*3;i++)pos2[i]=(Math.random()-.5)*90;
  geo2.setAttribute('position',new THREE.BufferAttribute(pos2,3));
  const mat2=new THREE.PointsMaterial({color:0xa78bfa,size:.28,transparent:true,opacity:.5});
  const pts2=new THREE.Points(geo2,mat2);scene.add(pts2);
  let t=0;(function a(){requestAnimationFrame(a);t+=.0022;pts.rotation.y=t*.28;pts.rotation.x=t*.12;pts2.rotation.y=-t*.18;pts2.rotation.z=t*.08;mat.color.setHex(hex());renderer.render(scene,camera);})();
  window.addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);});
})();

// ================================================================
//  AMBIENT + CLICK PARTICLES
// ================================================================
(()=>{
  const c=document.getElementById('ptc'); if(!c)return;
  const ctx=c.getContext('2d');
  const fit=()=>{c.width=innerWidth;c.height=innerHeight;};
  fit(); window.addEventListener('resize',fit);
  const reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const nStar=reduce?20:(innerWidth<700?70:120);
  let stars=[],burst=[];
  function pal(){const s=getComputedStyle(document.body);return[s.getPropertyValue('--p').trim()||'#7cf0ff',s.getPropertyValue('--s').trim()||'#a78bfa',s.getPropertyValue('--a').trim()||'#fb7185','#ffffff'];}
  function mkStar(){return{x:Math.random()*c.width,y:Math.random()*c.height,r:Math.random()*1.6+.3,v:.15+Math.random()*.55,a:.15+Math.random()*.55,tw:Math.random()*Math.PI*2};}
  for(let i=0;i<nStar;i++)stars.push(mkStar());
  function Burst(x,y){const cols=pal();this.x=x;this.y=y;this.vx=(Math.random()-.5)*6.5;this.vy=(Math.random()-.5)*6.5;this.a=1;this.sz=Math.random()*3.5+1;this.col=cols[Math.floor(Math.random()*cols.length)];}
  document.addEventListener('click',e=>{for(let i=0;i<(reduce?6:18);i++)burst.push(new Burst(e.clientX,e.clientY));});
  (function loop(){
    ctx.clearRect(0,0,c.width,c.height);
    const cols=pal();
    stars.forEach((s,i)=>{
      s.y-=s.v; s.tw+=.03; if(s.y<-8){s.y=c.height+8;s.x=Math.random()*c.width;}
      ctx.save(); ctx.globalAlpha=s.a*(.55+.45*Math.sin(s.tw)); ctx.fillStyle=cols[i%3];
      ctx.shadowBlur=8; ctx.shadowColor=cols[i%3];
      ctx.beginPath(); ctx.arc(s.x,s.y,s.r,0,Math.PI*2); ctx.fill(); ctx.restore();
    });
    burst=burst.filter(p=>p.a>.05);
    burst.forEach(p=>{p.x+=p.vx;p.y+=p.vy;p.vy+=.11;p.a-=.028;ctx.save();ctx.globalAlpha=p.a;ctx.fillStyle=p.col;ctx.shadowBlur=10;ctx.shadowColor=p.col;ctx.beginPath();ctx.arc(p.x,p.y,p.sz,0,Math.PI*2);ctx.fill();ctx.restore();});
    requestAnimationFrame(loop);
  })();
})();

// ================================================================
//  THEME SWITCHER
// ================================================================
document.querySelectorAll('.t-dot').forEach(d=>{d.addEventListener('click',()=>{document.querySelectorAll('.t-dot').forEach(x=>x.classList.remove('on'));d.classList.add('on');document.body.className=d.dataset.th||'th-blue';showToast('Theme changed! ✨');});});

// ================================================================
//  HAMBURGER NAV
// ================================================================
document.getElementById('hbg').addEventListener('click',()=>document.getElementById('n-links').classList.toggle('op'));
document.querySelectorAll('.n-links a').forEach(a=>a.addEventListener('click',()=>document.getElementById('n-links').classList.remove('op')));

// ================================================================
//  TOAST
// ================================================================
let toastT;
function showToast(m){const t=document.getElementById('toast');t.textContent=m;t.style.opacity='1';t.style.transform='translateX(-50%) translateY(0)';clearTimeout(toastT);toastT=setTimeout(()=>{t.style.opacity='0';t.style.transform='translateX(-50%) translateY(20px)';},2500);}

// ================================================================
//  SCROLL REVEAL
// ================================================================
const ro=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)e.target.classList.add('vis');}),{threshold:.1});
document.querySelectorAll('.rv').forEach(el=>ro.observe(el));

// ================================================================
//  TYPING ANIMATION
// ================================================================
const phrases=['Full-Stack Developer 💻','Math Educator 🧮','Problem Solver 🔥','Scientific Thinker ⚡','SANATANI 🙏','Web App Builder 🚀'];
let pi=0,ci=0,del=false;
const tel=document.getElementById('typed');
function typeLoop(){const cur2=phrases[pi];if(!del){tel.textContent=cur2.slice(0,++ci);if(ci===cur2.length){del=true;setTimeout(typeLoop,1800);return;}}else{tel.textContent=cur2.slice(0,--ci);if(ci===0){del=false;pi=(pi+1)%phrases.length;}}setTimeout(typeLoop,del?50:100);}
setTimeout(typeLoop,2600);

// ================================================================
//  VISITOR COUNTER — persistent, realistic
// ================================================================
(()=>{
  const BASE=2847; // real starting base
  const KEY='sidhi_visitors';
  let stored=parseInt(localStorage.getItem(KEY)||'0');
  // First visit or old data
  if(stored<BASE){stored=BASE;}
  stored++; // count this visit
  localStorage.setItem(KEY,stored);
  let vn=stored, cv=0;
  const viv=setInterval(()=>{
    cv+=Math.ceil((vn-cv)/8);
    document.getElementById('vcnt').textContent=cv.toLocaleString('en-IN');
    if(cv>=vn)clearInterval(viv);
  },40);
  // Simulate small random growth every 30s (other "visitors")
  setInterval(()=>{
    const delta=Math.floor(Math.random()*3)+1;
    vn+=delta;
    document.getElementById('vcnt').textContent=vn.toLocaleString('en-IN');
  },30000);
})();


// ================================================================
//  INSTAGRAM FOLLOWERS COUNTER
// ================================================================
(()=>{
  const target=990;
  let c=0;
  const el=document.getElementById('ig-count');
  if(!el)return;
  const iv=setInterval(()=>{
    c+=Math.ceil((target-c)/10);
    el.textContent=c>=target?target:c;
    if(c>=target){el.textContent=target;clearInterval(iv);}
  },50);
})();

// ================================================================
//  GITHUB REPOS
// ================================================================
const LC={JavaScript:'#f1e05a',Python:'#3572A5',HTML:'#e34c26',CSS:'#563d7c',TypeScript:'#2b7489',Shell:'#89e051',default:'#888'};
(async()=>{
  const g=document.getElementById('r-grid');
  try{
    const res=await fetch('https://api.github.com/users/SIDHIMUSIC/repos?sort=updated&per_page=30');
    if(!res.ok)throw new Error();
    const repos=await res.json();
    if(!repos.length){g.innerHTML='<p class="r-loading">No public repos found.</p>';return;}
    g.innerHTML='';
    repos.forEach(r=>{
      const c=document.createElement('div');c.className='gc r-card rv';
      const col=LC[r.language]||LC.default;
      c.innerHTML=`<div class="r-name"><i class="fas fa-code-branch" style="margin-right:.35rem;font-size:.7rem"></i>${r.name}</div>
        <div class="r-desc">${r.description||'No description available.'}</div>
        <div class="r-meta">${r.language?`<span style="display:flex;align-items:center;gap:.3rem"><span class="lang-dot" style="background:${col}"></span>${r.language}</span>`:''}
          <span><i class="fas fa-star" style="color:#ffd700"></i> ${r.stargazers_count}</span>
          <span><i class="fas fa-code-fork"></i> ${r.forks_count}</span></div>
        <div style="display:flex;gap:.4rem;flex-wrap:wrap">
          <a href="${r.html_url}" target="_blank" class="r-btn"><i class="fab fa-github"></i> Code</a>
          ${r.homepage?`<a href="${r.homepage}" target="_blank" class="r-btn" style="border-color:var(--s);color:var(--s)"><i class="fas fa-external-link-alt"></i> Demo</a>`:''}
        </div>`;
      g.appendChild(c);ro.observe(c);
    });
  }catch(e){g.innerHTML=`<p class="r-loading">Couldn't fetch repos. <a href="https://github.com/SIDHIMUSIC" target="_blank" style="color:var(--p)">View on GitHub →</a></p>`;}
})();

// ================================================================
//  FEATURED PROJECTS
// ================================================================
[{title:'SIDHI Music Hub',desc:'Full-stack music platform with streaming, playlists & real-time sync.',icon:'🎵',tags:['Node.js','React','WebAudio'],gh:'https://github.com/SIDHIMUSIC'},
 {title:'Dev Portfolio v3',desc:'This portfolio — Three.js particles, 22+ tools & raw creativity.',icon:'🚀',tags:['HTML','CSS','Three.js'],gh:'https://github.com/SIDHIMUSIC'},
 {title:'AI Prompt Vault',desc:'Curated AI prompts for creative & developer workflows.',icon:'🤖',tags:['JavaScript','AI','Productivity'],gh:'https://github.com/SIDHIMUSIC'}
].forEach(p=>{const d=document.createElement('div');d.className='gc rv';d.innerHTML=`<div class="f-icon">${p.icon}</div><div class="f-title">${p.title}</div><div class="f-desc">${p.desc}</div><div class="f-tags">${p.tags.map(t=>`<span class="f-tag">${t}</span>`).join('')}</div><div style="display:flex;gap:.7rem"><a href="${p.gh}" target="_blank" class="r-btn"><i class="fab fa-github"></i> Code</a></div>`;document.getElementById('f-grid').appendChild(d);ro.observe(d);});

// ================================================================
//  PROMPTS
// ================================================================
// Prompts section — button only
(()=>{
  const grid=document.getElementById('p-grid');
  if(!grid)return;
  const wrap=document.createElement('div');
  wrap.style.cssText='grid-column:1/-1;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:2.5rem 1rem;gap:1.2rem;';
  wrap.innerHTML=`
    <div style="font-family:var(--fm);font-size:.8rem;color:var(--mt);text-align:center;letter-spacing:.06em;">🤖 Saare AI prompts ek jagah mila diye hain —</div>
    <a href="http://harryprompt.online/" target="_blank"
      style="display:inline-flex;align-items:center;gap:.7rem;padding:.85rem 2rem;border-radius:100px;
             background:linear-gradient(135deg,var(--p),var(--s));color:var(--bg);
             font-family:var(--fd);font-size:.85rem;font-weight:800;letter-spacing:.08em;
             text-decoration:none;box-shadow:0 0 28px var(--glow);transition:transform .2s,box-shadow .2s;"
      onmouseover="this.style.transform='translateY(-4px) scale(1.04)';this.style.boxShadow='0 8px 40px var(--glow)'"
      onmouseout="this.style.transform='';this.style.boxShadow='0 0 28px var(--glow)'">
      🚀 <span>Harry's Prompt Vault kholo</span>
    </a>
    <div style="font-family:var(--fm);font-size:.65rem;color:var(--mt);">harryprompt.online</div>
  `;
  grid.appendChild(wrap);
})();

// ================================================================
//  SKILLS
// ================================================================
[{n:'JavaScript',p:90},{n:'HTML/CSS',p:95},{n:'Python',p:75},{n:'React',p:70},{n:'Node.js',p:65},{n:'Three.js',p:60},{n:'Git/GitHub',p:85},{n:'Music Production',p:80}
].forEach(s=>{const d=document.createElement('div');d.className='gc sk-item rv';d.innerHTML=`<div class="sk-name"><span>${s.n}</span><span>${s.p}%</span></div><div class="sk-bar"><div class="sk-fill" data-p="${s.p}"></div></div>`;document.getElementById('sk-grid').appendChild(d);ro.observe(d);});
new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){const f=e.target.querySelector('.sk-fill');if(f)f.style.width=f.dataset.p+'%';}}),{threshold:.3}).observe||0;
document.querySelectorAll('.sk-item').forEach(el=>new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){const f=e.target.querySelector('.sk-fill');if(f)f.style.width=f.dataset.p+'%';}}),{threshold:.3}).observe(el));

// ================================================================
//  TOOLS
// ================================================================
function showT(id,btn){document.querySelectorAll('.t-panel').forEach(p=>p.classList.remove('on'));document.querySelectorAll('.t-tab').forEach(t=>t.classList.remove('on'));document.getElementById(id).classList.add('on');btn.classList.add('on');}

// ── STUDY TIMER ──
let pInt=null,pSec=1500,pTot=1500,pRun=false,pCnt=0;
const tQs=['Ek baar shuru karo, motivation khud aa jaayega 🔥','Padhai mein dard hai, results mein khushi hai 💪','Phone rakh, timer chala — future ka winner ⚡','5 saal ki padhai = 50 saal ki freedom 🏆','Hard work beats talent when talent doesnt work hard 🎯'];
function lerpC(c1,c2,t){const[r1,g1,b1]=[parseInt(c1.slice(1,3),16),parseInt(c1.slice(3,5),16),parseInt(c1.slice(5,7),16)];const[r2,g2,b2]=[parseInt(c2.slice(1,3),16),parseInt(c2.slice(3,5),16),parseInt(c2.slice(5,7),16)];return '#'+(Math.round(r1+(r2-r1)*t)).toString(16).padStart(2,'0')+(Math.round(g1+(g2-g1)*t)).toString(16).padStart(2,'0')+(Math.round(b1+(b2-b1)*t)).toString(16).padStart(2,'0');}
function tColor(f){return f>.5?lerpC('#fbbf24','#3b82f6',(f-.5)/.5):lerpC('#ef4444','#fbbf24',f/.5);}
function updP(){const m=Math.floor(pSec/60).toString().padStart(2,'0'),s=(pSec%60).toString().padStart(2,'0');const te=document.getElementById('t-time');if(te)te.textContent=m+':'+s;const prog=document.getElementById('t-ring');if(prog){const f=pSec/pTot;prog.style.strokeDashoffset=327*(1-f);const col=tColor(f);prog.setAttribute('stroke',col);prog.style.filter='drop-shadow(0 0 10px '+col+')';if(te)te.style.color=col;}const bar=document.getElementById('t-bar');if(bar)bar.style.width=(pSec/pTot*100)+'%';}
function setPreset(m,lbl,btn){document.querySelectorAll('#t-presets .pm-btn').forEach(b=>b.classList.remove('on'));btn.classList.add('on');pReset();pSec=m*60;pTot=m*60;document.getElementById('t-lbl').textContent=lbl;document.getElementById('c-min').value=m;document.getElementById('c-sec').value=0;updP();}
function applyCustom(){const m=parseInt(document.getElementById('c-min').value)||0,s=parseInt(document.getElementById('c-sec').value)||0,tot=m*60+s;if(tot<1)return;pReset();pSec=tot;pTot=tot;document.querySelectorAll('#t-presets .pm-btn').forEach(b=>b.classList.remove('on'));document.getElementById('t-lbl').textContent='Custom '+m+'m '+s+'s ⚡';updP();showToast('Timer set: '+m+'m '+s+'s ✅');}
function pStart(){if(pRun)return;pRun=true;const q=tQs[Math.floor(Math.random()*tQs.length)];const qe=document.getElementById('t-quote');if(qe)qe.textContent='"'+q+'"';pInt=setInterval(()=>{pSec--;updP();if(pSec<=0){clearInterval(pInt);pRun=false;pCnt++;document.getElementById('p-sess').textContent=pCnt;const st=document.getElementById('p-strk');if(st)st.textContent=pCnt>=4?'🏆 Superstar!':pCnt>=2?'🔥 On fire!':'';showToast('⏰ Done! '+pCnt+' sessions 🔥');try{const ac=new(AudioContext||webkitAudioContext)();[0,.15,.3].forEach(t=>{const o=ac.createOscillator(),g=ac.createGain();o.connect(g);g.connect(ac.destination);o.frequency.value=880;g.gain.setValueAtTime(.3,ac.currentTime+t);g.gain.exponentialRampToValueAtTime(.001,ac.currentTime+t+.12);o.start(ac.currentTime+t);o.stop(ac.currentTime+t+.13);});}catch(e){}}},1000);}
function pPause(){clearInterval(pInt);pRun=false;showToast('⏸ Timer paused');}
function pReset(){clearInterval(pInt);pRun=false;pSec=pTot;updP();}
updP();

// ── STOPWATCH ──
let swMs=0,swInt=null,swRun=false,swLps=[],swLS=0;
function swFmt(ms){return Math.floor(ms/60000).toString().padStart(2,'0')+':'+Math.floor((ms%60000)/1000).toString().padStart(2,'0')+'.'+Math.floor((ms%1000)/100);}
function swStart(){if(swRun)return;swRun=true;document.getElementById('sw-sb').textContent='▶ Running';document.getElementById('sw-s').textContent='Chal raha hai ▶';const st=Date.now()-swMs;swInt=setInterval(()=>{swMs=Date.now()-st;document.getElementById('sw-d').textContent=swFmt(swMs);},100);}
function swLap(){if(!swRun)return;const lt=swMs,sp=swMs-swLS;swLS=swMs;swLps.unshift({n:swLps.length+1,t:lt,s:sp});const c=document.getElementById('sw-laps'),d=document.createElement('div');d.className='sw-lap';d.innerHTML='<span class="lap-n">Lap '+swLps[0].n+'</span><span class="lap-t">'+swFmt(lt)+'</span><span class="lap-s">+'+swFmt(sp)+'</span>';c.insertBefore(d,c.firstChild);showToast('🏁 Lap '+swLps[0].n+' — '+swFmt(lt));}
function swReset(){clearInterval(swInt);swRun=false;swMs=0;swLps=[];swLS=0;document.getElementById('sw-d').textContent='00:00.0';document.getElementById('sw-s').textContent='Ruka hua hai ⏸';document.getElementById('sw-laps').innerHTML='';document.getElementById('sw-sb').textContent='▶ Start';}

// ── CALCULATOR ──
function showCS(id,btn){document.querySelectorAll('#t-calc .c-sub').forEach(p=>p.classList.remove('on'));document.querySelectorAll('#t-calc .pm-btn').forEach(b=>b.classList.remove('on'));document.getElementById(id).classList.add('on');btn.classList.add('on');}
function calcPct(){const o=parseFloat(document.getElementById('c-obt').value),t=parseFloat(document.getElementById('c-tot').value),r=document.getElementById('r-pct');if(isNaN(o)||isNaN(t)||t===0){r.style.display='block';r.textContent='⚠️ Dono values daalo!';return;}const p=(o/t*100).toFixed(2);r.style.display='block';r.innerHTML=p+'% | Grade: '+(p>=90?'A+ 🌟':p>=80?'A 😎':p>=70?'B+ 👍':p>=60?'B 😊':p>=50?'C 🙂':'Fail 😢');}
function calcDisc(){const pr=parseFloat(document.getElementById('c-pr').value),dc=parseFloat(document.getElementById('c-dc').value),r=document.getElementById('r-disc');if(!pr||!dc){r.style.display='block';r.textContent='⚠️ Fill both!';return;}r.style.display='block';r.innerHTML='₹'+(pr-pr*dc/100).toFixed(0)+' pay | Save ₹'+(pr*dc/100).toFixed(0)+' 🎉';}
function calcCGPA(){const ms=document.getElementById('c-mks').value,mx=parseFloat(document.getElementById('c-max').value)||100,r=document.getElementById('r-cgpa');if(!ms.trim()){r.style.display='block';r.textContent='⚠️ Marks daalo!';return;}const marks=ms.split(',').map(m=>parseFloat(m.trim())).filter(m=>!isNaN(m));if(!marks.length){r.style.display='block';r.textContent='⚠️ Format galat!';return;}const avg=marks.reduce((a,b)=>a+b,0)/marks.length,pct=(avg/mx*100).toFixed(1);r.style.display='block';r.innerHTML='Avg: '+avg.toFixed(1)+' | '+pct+'% | CGPA: '+(pct/9.5).toFixed(2);}
function calcExpr(){let ex=document.getElementById('c-ex').value,r=document.getElementById('r-expr');try{ex=ex.replace(/(\d+\.?\d*)\s*%\s*of\s*(\d+\.?\d*)/gi,'($2*$1/100)').replace(/sqrt\(([^)]+)\)/gi,'Math.sqrt($1)').replace(/(\d+\.?\d*)%/g,'($1/100)');if(!/^[0-9+\-*/().,\sMathsqrt]+$/.test(ex.replace(/Math\.sqrt/g,'Mathsqrt'))){r.style.display='block';r.textContent='Invalid expression';return;}r.style.display='block';r.textContent='= '+Function('"use strict";return('+ex+')')();}catch(e){r.style.display='block';r.textContent='Invalid expression';}}

// ── UNIT CONVERTER ──
function showUT(id,btn){document.querySelectorAll('#t-unit .c-sub').forEach(p=>p.classList.remove('on'));document.querySelectorAll('#t-unit .pm-btn').forEach(b=>b.classList.remove('on'));document.getElementById(id).classList.add('on');btn.classList.add('on');}
function rv(v,d=4){return parseFloat(v.toFixed(d))||'';}
function cvtLen(f){let k;const[km,mi,m,ft]=['u-km','u-mi','u-m','u-ft'].map(i=>document.getElementById(i));if(f==='km')k=parseFloat(km.value);else if(f==='mi')k=parseFloat(mi.value)*1.60934;else if(f==='m')k=parseFloat(m.value)/1000;else k=parseFloat(ft.value)*.0003048;if(isNaN(k))return;if(f!=='km')km.value=rv(k);if(f!=='mi')mi.value=rv(k/1.60934);if(f!=='m')m.value=rv(k*1000);if(f!=='ft')ft.value=rv(k/.0003048);}
function cvtWgt(f){let k;const[kg,lb,g,oz]=['u-kg','u-lb','u-g','u-oz'].map(i=>document.getElementById(i));if(f==='kg')k=parseFloat(kg.value);else if(f==='lb')k=parseFloat(lb.value)*.453592;else if(f==='g')k=parseFloat(g.value)/1000;else k=parseFloat(oz.value)*.0283495;if(isNaN(k))return;if(f!=='kg')kg.value=rv(k);if(f!=='lb')lb.value=rv(k/.453592);if(f!=='g')g.value=rv(k*1000);if(f!=='oz')oz.value=rv(k/.0283495);}
function cvtTmp(f){let c;if(f==='c')c=parseFloat(document.getElementById('u-c').value);else if(f==='f')c=(parseFloat(document.getElementById('u-f').value)-32)*5/9;else c=parseFloat(document.getElementById('u-k').value)-273.15;if(isNaN(c))return;if(f!=='c')document.getElementById('u-c').value=rv(c);if(f!=='f')document.getElementById('u-f').value=rv(c*9/5+32);if(f!=='k')document.getElementById('u-k').value=rv(c+273.15);}

// ── BMI ──
let bmiU='metric';
function setBMIUnit(u,btn){bmiU=u;document.querySelectorAll('#t-bmi .pm-btn').forEach(b=>b.classList.remove('on'));btn.classList.add('on');document.getElementById('bmi-met').style.display=u==='metric'?'block':'none';document.getElementById('bmi-imp').style.display=u==='imperial'?'block':'none';document.getElementById('bmi-res').style.display='none';}
function doBMI(){let wkg,hm;const age=parseInt(document.getElementById('b-age').value)||0,gen=document.getElementById('b-gen').value;if(bmiU==='metric'){wkg=parseFloat(document.getElementById('bw-kg').value);const hcm=parseFloat(document.getElementById('bh-cm').value);if(!wkg||!hcm){document.getElementById('bmi-res').style.display='none';return;}hm=hcm/100;}else{const lb=parseFloat(document.getElementById('bw-lb').value),ft=parseFloat(document.getElementById('bh-ft').value)||0,inch=parseFloat(document.getElementById('bh-in').value)||0;if(!lb||(!ft&&!inch)){document.getElementById('bmi-res').style.display='none';return;}wkg=lb*.453592;hm=(ft*12+inch)*.0254;}
const bmi=wkg/(hm*hm),br=bmi.toFixed(1);
let cat,col,emo,ac;
if(bmi<16){cat='Severely Underweight';col='#3b82f6';emo='😟';ac='rgba(59,130,246,.1)';}
else if(bmi<18.5){cat='Underweight';col='#60a5fa';emo='😕';ac='rgba(96,165,250,.1)';}
else if(bmi<25){cat='Normal ✅';col='#22c55e';emo='😄';ac='rgba(34,197,94,.1)';}
else if(bmi<30){cat='Overweight';col='#fbbf24';emo='😐';ac='rgba(251,191,36,.1)';}
else if(bmi<35){cat='Obese — Class I';col='#f97316';emo='😟';ac='rgba(249,115,22,.1)';}
else{cat='Obese — Class II+';col='#ef4444';emo='⚠️';ac='rgba(239,68,68,.1)';}
const im=(18.5*hm*hm).toFixed(1),ix=(24.9*hm*hm).toFixed(1),df=wkg-24.9*hm*hm,da=Math.abs(df).toFixed(1),dt=df>.5?'Lose '+da+' kg':df<-.5?'Gain '+da+' kg':'✅ Perfect!';
let bmr=gen==='male'?88.36+13.4*wkg+4.8*hm*100-5.7*(age||20):447.6+9.2*wkg+3.1*hm*100-4.3*(age||20);
const tdee=Math.round(bmr*1.55);
const am={'Severely Underweight':'Bahut kam weight! Doctor se milna chahiye. Protein rich khana khao 💊','Underweight':'Weight thoda kam. Healthy fats badhao — Nuts, Banana, Ghee 🥜','Normal ✅':'Mast ho bhai! Weight sahi hai. Active raho 🔥','Overweight':'Thoda zyada hai. 30 min walk daily, sugar kam karo 🚶','Obese — Class I':'Nutritionist se milna helpful. Exercise + healthy eating 💪','Obese — Class II+':'Please doctor se consult karo. Medical guidance chahiye ❤️'};
document.getElementById('bmi-res').style.display='block';
const ne=document.getElementById('bmi-num');ne.textContent=br;ne.style.color=col;
const ce=document.getElementById('bmi-cat');ce.textContent=cat;ce.style.color=col;
document.getElementById('bmi-emo').textContent=emo;
document.getElementById('bmi-ndl').style.left=Math.min(100,Math.max(0,(bmi-16)/24*100))+'%';
document.getElementById('bmi-idl').textContent=im+' – '+ix+' kg';
document.getElementById('bmi-dif').textContent=dt;document.getElementById('bmi-dif').style.color=df>.5?'#f97316':df<-.5?'#60a5fa':'#22c55e';
document.getElementById('bmi-cal').textContent='~'+tdee+' kcal/day';
document.getElementById('bmi-sta').textContent=bmi<18.5?'⬇ Low':bmi<25?'✅ Good':bmi<30?'⬆ High':'🚨 Alert';
document.getElementById('bmi-sta').style.color=col;
const adv=document.getElementById('bmi-adv');adv.textContent=am[cat]||am['Normal ✅'];adv.style.background=ac;adv.style.borderLeftColor=col;}

// ── EMI ──
function doEMI(){const P=parseFloat(document.getElementById('e-loan').value),ar=parseFloat(document.getElementById('e-rate').value),N=parseFloat(document.getElementById('e-mon').value);if(!P||!ar||!N){showToast('Sab fields bharo! 💸');return;}const r=ar/12/100,emi=P*r*Math.pow(1+r,N)/(Math.pow(1+r,N)-1),tot=emi*N,int=tot-P,f=v=>'₹'+Math.round(v).toLocaleString('en-IN');document.getElementById('e-mo').textContent=f(emi);document.getElementById('e-tot').textContent=f(tot);document.getElementById('e-int').textContent=f(int);document.getElementById('e-res').style.display='block';}

// ── AGE ──
document.addEventListener('DOMContentLoaded',()=>{const d=document.getElementById('dob-i');if(d)d.max=new Date().toISOString().split('T')[0];});
function doAge(){const dv=document.getElementById('dob-i').value;if(!dv){showToast('Date daalo! 📅');return;}const b=new Date(dv),n=new Date();let y=n.getFullYear()-b.getFullYear(),m=n.getMonth()-b.getMonth(),d=n.getDate()-b.getDate();if(d<0){m--;d+=new Date(n.getFullYear(),n.getMonth(),0).getDate();}if(m<0){y--;m+=12;}const nb=new Date(n.getFullYear(),b.getMonth(),b.getDate());if(nb<=n)nb.setFullYear(n.getFullYear()+1);const dl=Math.ceil((nb-n)/864e5),td=Math.floor((n-b)/864e5);const r=document.getElementById('age-r');r.style.display='block';r.innerHTML=y+' Saal '+m+' Mahine '+d+' Din 🎉';const x=document.getElementById('age-x');x.style.display='block';x.innerHTML='📅 Total days alive: <b style="color:var(--p)">'+td.toLocaleString()+'</b><br>🎂 Next Birthday in: <b style="color:var(--p)">'+dl+' days</b><br>⏰ Total hours: <b style="color:var(--p)">'+(td*24).toLocaleString()+'</b>';}

// ── WORLD CLOCK ──
const WC=[{n:'🇮🇳 India (IST)',tz:'Asia/Kolkata'},{n:'🇺🇸 New York',tz:'America/New_York'},{n:'🇬🇧 London',tz:'Europe/London'},{n:'🇯🇵 Tokyo',tz:'Asia/Tokyo'},{n:'🇦🇺 Sydney',tz:'Australia/Sydney'},{n:'🇦🇪 Dubai',tz:'Asia/Dubai'}];
function renderWC(){const c=document.getElementById('wc-wrap');if(!c)return;const now=new Date();c.innerHTML=WC.map(ci=>{const ts=now.toLocaleTimeString('en-US',{timeZone:ci.tz,hour:'2-digit',minute:'2-digit',second:'2-digit'}),ds=now.toLocaleDateString('en-IN',{timeZone:ci.tz,weekday:'short',day:'numeric',month:'short'});return`<div class="wc-i"><div><div class="wc-city">${ci.n}</div></div><div style="text-align:right"><div class="wc-time">${ts}</div><div class="wc-date">${ds}</div></div></div>`;}).join('');}
renderWC();setInterval(renderWC,1000);

// ── QUICK NOTES ──
const qnEl=document.getElementById('q-note');
if(qnEl){qnEl.value=localStorage.getItem('hn')||'';updNC();qnEl.addEventListener('input',()=>{localStorage.setItem('hn',qnEl.value);updNC();});}
function updNC(){const e=document.getElementById('n-chars');if(e&&qnEl)e.textContent=qnEl.value.length+' chars';}
function clearNote(){if(qnEl){qnEl.value='';localStorage.removeItem('hn');updNC();showToast('Notes cleared 🗑️');}}
function dlNote(){const txt=qnEl?qnEl.value:'';if(!txt.trim()){showToast('Kuch likho pehle! ✏️');return;}const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([txt],{type:'text/plain'}));a.download='notes-'+new Date().toLocaleDateString('en-GB').replace(/\//g,'-')+'.txt';a.click();showToast('Saved! ✅');}

// ── TODO ──
let todos=JSON.parse(localStorage.getItem('ht')||'[]');
function saveTD(){localStorage.setItem('ht',JSON.stringify(todos));}
function renderTD(){const list=document.getElementById('td-list'),empty=document.getElementById('td-empty'),stat=document.getElementById('td-stat');if(!list)return;list.querySelectorAll('.td-i').forEach(e=>e.remove());if(!todos.length){empty.style.display='block';stat.textContent='0 tasks';return;}empty.style.display='none';const dn=todos.filter(t=>t.done).length;stat.textContent=dn+'/'+todos.length+' done ✅';todos.forEach((t,i)=>{const d=document.createElement('div');d.className='td-i'+(t.done?' dn':'');d.innerHTML='<input type="checkbox" style="accent-color:var(--p);cursor:pointer;width:15px;height:15px;" '+(t.done?'checked':'')+' onchange="togTD('+i+')"><span class="td-t">'+t.text+'</span><button class="td-d" onclick="delTD('+i+')">✕</button>';list.insertBefore(d,list.lastElementChild);});}
function addTodo(){const inp=document.getElementById('td-inp'),v=inp.value.trim();if(!v){showToast('Kuch likho! 😅');return;}todos.unshift({text:v,done:false});inp.value='';saveTD();renderTD();showToast('Task added! ✅');}
function togTD(i){todos[i].done=!todos[i].done;saveTD();renderTD();}
function delTD(i){todos.splice(i,1);saveTD();renderTD();}
function clearDone(){const b=todos.length;todos=todos.filter(t=>!t.done);saveTD();renderTD();showToast((b-todos.length)+' done tasks hataaye! 🗑');}
renderTD();

// ── DECISION MAKER ──
const DEM=['🎯','⚡','🔥','💥','🌟','✨','🎪','🚀','🎰','🎭','💫','🎊','🏆','👑','🔮'];
function setDP(opts){document.getElementById('d-opts').value=opts.join('\n');showToast('Options set! 🎰');}
function spinDec(){const lines=(document.getElementById('d-opts').value||'').split('\n').map(l=>l.trim()).filter(Boolean);if(lines.length<2){showToast('Kam se kam 2 options daalo!');return;}const rd=document.getElementById('d-res'),sb=document.getElementById('spin-btn');sb.textContent='🌀 Universe Soch Raha Hai...';sb.disabled=true;rd.style.display='block';let cnt=0;const spd=[60,70,90,120,160,220];let si=0;function f(){const rnd=lines[Math.floor(Math.random()*lines.length)],em=DEM[Math.floor(Math.random()*DEM.length)];rd.innerHTML='<div class="d-em">'+em+'</div><div class="d-tx" style="opacity:.7">'+rnd+'</div>';cnt++;const dl=spd[Math.min(si,spd.length-1)];if(cnt<20){if(cnt>10)si++;setTimeout(f,dl);}else{const w=lines[Math.floor(Math.random()*lines.length)],fe=DEM[Math.floor(Math.random()*DEM.length)];rd.innerHTML='<div class="d-em">'+fe+'</div><div class="d-tx">'+w+'</div><div class="d-sx">Universe ka final answer! 🌌✨</div>';sb.textContent='🎰 Universe Decide Karega!';sb.disabled=false;showToast('Decision: '+w+' '+fe);}}f();}

// ── HABIT TRACKER ──
let habits=JSON.parse(localStorage.getItem('hh')||'[]');
let hDay=new Date().getDay();
(function(){document.querySelectorAll('#h-day-row .hd-btn').forEach((b,i)=>b.classList.toggle('on',i===hDay));})();
function setHDay(d,btn){hDay=d;document.querySelectorAll('#h-day-row .hd-btn').forEach(b=>b.classList.remove('on'));btn.classList.add('on');renderH();}
function saveH(){localStorage.setItem('hh',JSON.stringify(habits));}
function addHabit(){const inp=document.getElementById('h-inp'),v=inp.value.trim();if(!v){showToast('Habit naam likho! 🏆');return;}habits.push({id:Date.now(),name:v,done:Array(7).fill(false),streak:0});inp.value='';saveH();renderH();showToast('Habit add! 🔥');}
function togH(id){const h=habits.find(x=>x.id===id);if(!h)return;h.done[hDay]=!h.done[hDay];h.streak=h.done.filter(Boolean).length;saveH();renderH();if(h.done[hDay])showToast('✅ '+h.name+' done! 🔥');}
function delH(id){habits=habits.filter(h=>h.id!==id);saveH();renderH();}
function renderH(){const list=document.getElementById('h-list'),empty=document.getElementById('h-empty'),sum=document.getElementById('h-sum');if(!list)return;list.innerHTML='';if(!habits.length){empty.style.display='block';sum.style.display='none';return;}empty.style.display='none';const dn=habits.filter(h=>h.done[hDay]).length;sum.style.display='block';const pct=Math.round(dn/habits.length*100);sum.innerHTML='<b style="color:var(--p)">'+dn+'/'+habits.length+'</b> done today ('+pct+'%) — '+(pct===100?'🏆 Perfect Day!':pct>=50?'💪 Acha!':'🔥 Shuru karo!');habits.forEach(h=>{const don=h.done[hDay];const d=document.createElement('div');d.className='h-item'+(don?' don':'');const dots=h.done.map(x=>'<div class="h-dot'+(x?' d':'')+'"></div>').join('');d.innerHTML='<button class="h-chk'+(don?' don':'')+'" onclick="togH('+h.id+')">'+(don?'✓':'')+'</button><div style="flex:1"><div class="h-nm">'+h.name+'</div><div style="display:flex;align-items:center;gap:8px;margin-top:3px"><div class="h-dots">'+dots+'</div><span class="h-str">🔥 '+h.streak+'/7</span></div></div><button class="h-del" onclick="delH('+h.id+')">✕</button>';list.appendChild(d);});}
renderH();

// ── TIMETABLE ──
const TTD=['Mon','Tue','Wed','Thu','Fri','Sat'],TTS=['9-10','10-11','11-12','12-1','2-3','3-4','4-5'];
let ttData=JSON.parse(localStorage.getItem('htt')||'{}'),ttKey=null;
function buildTT(){const g=document.getElementById('tt-grid');if(!g)return;g.innerHTML='';const corner=document.createElement('div');corner.className='tt-hd';corner.textContent='⏰';g.appendChild(corner);TTD.forEach(d=>{const h=document.createElement('div');h.className='tt-hd';h.textContent=d;g.appendChild(h);});TTS.forEach(slot=>{const se=document.createElement('div');se.className='tt-hd';se.style.cssText='font-size:8px;color:var(--mt);font-weight:600;';se.textContent=slot;g.appendChild(se);TTD.forEach(day=>{const key=day+'_'+slot,val=ttData[key]||'';const cell=document.createElement('div');cell.className='tt-sl'+(val?' fil':'');cell.textContent=val||'+';cell.onclick=()=>openTTM(key,val);g.appendChild(cell);});});}
function openTTM(k,cur){ttKey=k;document.getElementById('tt-mi').value=cur;document.getElementById('tt-modal').classList.add('op');setTimeout(()=>document.getElementById('tt-mi').focus(),100);}
function closeTTM(){document.getElementById('tt-modal').classList.remove('op');ttKey=null;}
function saveTTS(){if(!ttKey)return;const v=document.getElementById('tt-mi').value.trim();if(v)ttData[ttKey]=v;else delete ttData[ttKey];localStorage.setItem('htt',JSON.stringify(ttData));closeTTM();buildTT();showToast(v?'📅 Subject saved!':'🗑 Slot cleared!');}
document.getElementById('tt-mi')&&document.getElementById('tt-mi').addEventListener('keydown',e=>{if(e.key==='Enter')saveTTS();if(e.key==='Escape')closeTTM();});
function clearTT(){ttData={};localStorage.setItem('htt','{}');buildTT();showToast('Timetable cleared!');}
function dlTT(){showToast('Screenshot lo phone se 📸');}
buildTT();

// ── EXAM COUNTDOWN ──
let exams=JSON.parse(localStorage.getItem('hex')||'[]'),exInt=null;
function addExam(){const n=document.getElementById('ex-n').value.trim(),d=document.getElementById('ex-d').value;if(!n){showToast('Exam naam likho! 📝');return;}if(!d){showToast('Date choose karo! 📅');return;}if(new Date(d)<=new Date()){showToast('Future date choose karo! ⏰');return;}exams.push({name:n,date:d,id:Date.now()});localStorage.setItem('hex',JSON.stringify(exams));document.getElementById('ex-n').value='';document.getElementById('ex-d').value='';renderExams();showToast('Exam added! Study karo 🔥');}
function delExam(id){exams=exams.filter(e=>e.id!==id);localStorage.setItem('hex',JSON.stringify(exams));renderExams();}
function renderExams(){const list=document.getElementById('ex-list');if(!list)return;list.innerHTML='';if(!exams.length){list.innerHTML='<div style="text-align:center;color:var(--mt);font-family:var(--fm);font-size:.73rem;padding:11px 0;">No exams added yet 📅</div>';return;}exams.forEach(ex=>{const now=new Date(),target=new Date(ex.date),diff=target-now;if(diff<0)return;const days=Math.floor(diff/864e5),hours=Math.floor((diff%864e5)/36e5),mins=Math.floor((diff%36e5)/6e4),urg=days<=7;const d=document.createElement('div');d.className='ex-card'+(urg?' urg':'');d.innerHTML='<button class="ex-del" onclick="delExam('+ex.id+')">✕</button><div class="ex-nm">'+ex.name+'</div><div class="ex-row"><div class="ex-u"><span class="ex-n">'+days+'</span><span class="ex-l">Days</span></div><div class="ex-u"><span class="ex-n">'+hours+'</span><span class="ex-l">Hours</span></div><div class="ex-u"><span class="ex-n">'+mins+'</span><span class="ex-l">Mins</span></div></div>'+(urg?'<div style="font-family:var(--fm);font-size:.63rem;color:#ef4444;text-align:center;margin-top:4px;font-weight:700;">⚠️ Exam paas aa raha hai! Padho!</div>':'');list.appendChild(d);});}
renderExams();exInt=setInterval(renderExams,60000);

// ── BREATHING ──
const BM={box:{phases:['Inhale','Hold','Exhale','Hold'],durs:[4,4,4,4],ins:'4-4-4-4 | Calms the nervous system 🧠'},'478':{phases:['Inhale','Hold','Exhale',''],durs:[4,7,8,0],ins:'4-7-8 | Best for sleep & anxiety 😌'},tri:{phases:['Inhale','Hold','Exhale',''],durs:[4,4,4,0],ins:'4-4-4 | Simple & effective ✨'}};
let bMode='box',bInt=null,bCyc=0,bPhI=0,bPhT=0,bRun=false;
function setBM(m,btn){bMode=m;document.querySelectorAll('#br-modes .pm-btn').forEach(b=>b.classList.remove('on'));btn.classList.add('on');const ins=document.getElementById('br-ins');if(ins)ins.textContent=BM[m].ins;stopB();}
function startB(){if(bRun)return;bRun=true;bPhI=0;bPhT=0;bCyc=0;document.getElementById('br-sbtn').textContent='🌬️ Running';runBP();bInt=setInterval(runBP,1000);}
function runBP(){const md=BM[bMode],ph=md.phases[bPhI],dur=md.durs[bPhI];if(dur===0){bPhI=(bPhI+1)%md.phases.length;if(bPhI===0){bCyc++;updBC();}return;}const rem=dur-bPhT;const ep=document.getElementById('br-ph'),ec=document.getElementById('br-cnt');if(ep)ep.textContent=ph||'';if(ec)ec.textContent=rem;const ring=document.getElementById('br-ring'),inn=document.getElementById('br-inn');if(ring&&inn){if(ph==='Inhale'){ring.style.transform='scale(1.2)';ring.style.borderColor='var(--p)';ring.style.boxShadow='0 0 30px var(--glow)';inn.style.transform='scale(1.15)';}else if(ph==='Exhale'){ring.style.transform='scale(.85)';ring.style.borderColor='rgba(123,47,255,.5)';ring.style.boxShadow='none';inn.style.transform='scale(.88)';}else{ring.style.transform='scale(1.05)';ring.style.boxShadow='0 0 15px var(--glow)';}}bPhT++;if(bPhT>=dur){bPhT=0;bPhI=(bPhI+1)%md.phases.length;if(bPhI===0){bCyc++;updBC();}}}
function updBC(){const e=document.getElementById('br-cyc');if(e)e.textContent=bCyc;if(bCyc>0&&bCyc%4===0)showToast('🌬️ '+bCyc+' cycles done! Feeling better? 😌');}
function stopB(){clearInterval(bInt);bRun=false;bInt=null;const ep=document.getElementById('br-ph'),ec=document.getElementById('br-cnt'),btn=document.getElementById('br-sbtn');if(ep)ep.innerHTML='Press<br>Start';if(ec)ec.textContent='';if(btn)btn.textContent='🌬️ Start';const ring=document.getElementById('br-ring'),inn=document.getElementById('br-inn');if(ring){ring.style.transform='scale(1)';ring.style.borderColor='rgba(0,212,255,.2)';ring.style.boxShadow='';}if(inn)inn.style.transform='scale(1)';}
const brIns=document.getElementById('br-ins');if(brIns)brIns.textContent=BM[bMode].ins;

// ── PASSWORD ──
function genPass(){const len=parseInt(document.getElementById('ps-sl').value),U=document.getElementById('ps-u').checked,L=document.getElementById('ps-l').checked,N=document.getElementById('ps-n').checked,S=document.getElementById('ps-s').checked;let ch='';if(U)ch+='ABCDEFGHIJKLMNOPQRSTUVWXYZ';if(L)ch+='abcdefghijklmnopqrstuvwxyz';if(N)ch+='0123456789';if(S)ch+='!@#$%^&*()_+-=[]{}|;:,.<>?';if(!ch){showToast('Select at least one option!');return;}let pass='';for(let i=0;i<len;i++)pass+=ch[Math.floor(Math.random()*ch.length)];document.getElementById('ps-out').textContent=pass;let sc=0;if(U&&/[A-Z]/.test(pass))sc++;if(L&&/[a-z]/.test(pass))sc++;if(N&&/[0-9]/.test(pass))sc++;if(S&&/[^A-Za-z0-9]/.test(pass))sc++;if(len>=16)sc++;const f=document.getElementById('ps-fill'),lb=document.getElementById('ps-lbl');const lvs=[{w:'20%',c:'#ef4444',t:'Weak 😟'},{w:'40%',c:'#f97316',t:'Fair 😐'},{w:'60%',c:'#eab308',t:'Good 🙂'},{w:'80%',c:'#22c55e',t:'Strong 💪'},{w:'100%',c:'#00d4ff',t:'Very Strong 🔥'}];const lv=lvs[Math.min(sc-1,4)]||lvs[0];f.style.width=lv.w;f.style.background=lv.c;lb.textContent=lv.t;}
function cpyPass(){const p=document.getElementById('ps-out').textContent;if(p==='Click generate 👇'){showToast('Pehle generate karo! 🔐');return;}navigator.clipboard.writeText(p).then(()=>{showToast('Password copied! ✅');pulseBtn(document.querySelector('#t-pass [onclick="cpyPass()"]'));});}
genPass();

// ── QR CODE ──
function genQR(){const v=document.getElementById('qr-i').value;if(!v)return;const out=document.getElementById('qr-o');out.innerHTML='';QRCode.toCanvas(v,{width:200,color:{dark:'#00d4ff',light:'#030712'}},function(err,canvas){if(!err)out.appendChild(canvas);});}

// ── JSON ──
function fmtJSON(){try{const j=JSON.parse(document.getElementById('j-in').value);document.getElementById('j-out').textContent=JSON.stringify(j,null,2);document.getElementById('j-out').style.color='var(--tx)';}catch(e){document.getElementById('j-out').textContent='Invalid JSON: '+e.message;document.getElementById('j-out').style.color='var(--a)';}}
function minJSON(){try{const j=JSON.parse(document.getElementById('j-in').value);document.getElementById('j-out').textContent=JSON.stringify(j);}catch(e){document.getElementById('j-out').textContent='Invalid JSON';}}

// ── TTS ──
function doTTS(){window.speechSynthesis.cancel();const utt=new SpeechSynthesisUtterance(document.getElementById('tts-t').value);utt.rate=+document.getElementById('tts-r').value;utt.pitch=+document.getElementById('tts-p').value;window.speechSynthesis.speak(utt);}

// ── AI ROAST ──
let roastLvl='Light & Funny';
function setRL(btn,val){document.querySelectorAll('#r-lvls .pm-btn').forEach(b=>b.classList.remove('on'));btn.classList.add('on');roastLvl=val;}
async function genRoast(){const info=document.getElementById('r-info').value.trim(),btn=document.getElementById('r-btn'),out=document.getElementById('r-out'),cpb=document.getElementById('r-cpb');btn.textContent='⏳ AI roast taiyyar...';btn.disabled=true;out.style.display='none';cpb.style.display='none';try{const p=encodeURIComponent('You are a savage Hinglish roast comedian. Roast: "'+(info||'ek aam Indian student jo din raat phone chalata hai')+'". Roast level: '+roastLvl+'. Write 5 funny roast lines in Hinglish. Hilarious and relatable!');const res=await fetch('https://text.pollinations.ai/'+p+'?model=openai&seed='+Math.floor(Math.random()*999999),{signal:AbortSignal.timeout(12000)});out.textContent=res.ok?await res.text():'⚠️ AI busy hai. Dobara try karo!';out.style.display='block';if(res.ok)cpb.style.display='block';}catch(e){out.textContent='⚠️ AI se response nahi aaya. Try again! 😅';out.style.display='block';}btn.textContent='💀 Mujhe Roast Karo!';btn.disabled=false;}

// ── AI STUDY ──
let sSty='Simple Hindi mein';
function setSS(btn,val){document.querySelectorAll('#s-stls .pm-btn').forEach(b=>b.classList.remove('on'));btn.classList.add('on');sSty=val;}
async function genStudy(){const topic=document.getElementById('s-topic').value.trim();if(!topic){showToast('Topic toh likho! 📚');return;}const btn=document.getElementById('s-btn'),out=document.getElementById('s-out'),cpb=document.getElementById('s-cpb');btn.textContent='⏳ AI padha raha hai...';btn.disabled=true;out.style.display='none';cpb.style.display='none';try{const p=encodeURIComponent('Explain "'+topic+'" in '+sSty+'. Easy, engaging, memorable. Include examples and key points.');const res=await fetch('https://text.pollinations.ai/'+p+'?model=openai&seed='+Math.floor(Math.random()*999999),{signal:AbortSignal.timeout(14000)});out.textContent=res.ok?await res.text():'⚠️ Try again!';out.style.display='block';if(res.ok)cpb.style.display='block';}catch(e){out.textContent='⚠️ AI se response nahi aaya. Dobara try karo! 📖';out.style.display='block';}btn.textContent='🧠 Explain Karo AI!';btn.disabled=false;}
function cpyAI(oid,bid){navigator.clipboard.writeText(document.getElementById(oid).textContent).then(()=>{const b=document.getElementById(bid),o=b.textContent;b.textContent='✅ Copied!';pulseBtn(b);setTimeout(()=>b.textContent=o,2000);showToast('Copied! ✅');});}

// ── BGMI ──
let bgSess=JSON.parse(localStorage.getItem('bgmi')||'[]');
function showBGTab(id,btn){document.querySelectorAll('.bg-pnl').forEach(p=>{p.style.display='none';p.classList.remove('on');});document.querySelectorAll('#t-bgmi .bg-tab').forEach(b=>b.classList.remove('on'));document.getElementById(id).style.display='block';document.getElementById(id).classList.add('on');btn.classList.add('on');}
function calcBG(){const m=+document.getElementById('bg-m').value||0,w=+document.getElementById('bg-w').value||0,k=+document.getElementById('bg-k').value||0,d=+document.getElementById('bg-d').value||0;if(!m){document.getElementById('bg-res').style.display='none';return;}const wr=(w/m*100).toFixed(1),kpg=(k/m).toFixed(2),dpg=(d/m).toFixed(0),grade=wr>=20?'🏆 Conqueror!':wr>=10?'💎 Ace!':wr>=5?'🥇 Crown!':wr>=2?'🥈 Platinum!':'💪 Keep grinding!';const el=document.getElementById('bg-res');el.style.display='block';el.innerHTML='🏆 Win Rate: <b style="color:#ef4444">'+wr+'%</b> | ☠️ K/G: <b style="color:#f87171">'+kpg+'</b><br>💥 Avg Damage: <b style="color:#fbbf24">'+dpg+'</b> | '+grade;}
function saveBG(){const m=+document.getElementById('bg-m').value||0;if(!m){showToast('Pehle stats bhar!');return;}bgSess.unshift({m,w:+document.getElementById('bg-w').value||0,k:+document.getElementById('bg-k').value||0,d:+document.getElementById('bg-d').value||0,date:new Date().toLocaleDateString('en-IN'),id:Date.now()});if(bgSess.length>5)bgSess.pop();localStorage.setItem('bgmi',JSON.stringify(bgSess));renderBGH();showToast('Session saved! Gg ez 🔥');}
function clearBG(){['bg-m','bg-w','bg-k','bg-d'].forEach(id=>{const el=document.getElementById(id);if(el)el.value='';});document.getElementById('bg-res').style.display='none';}
function delBG(id){bgSess=bgSess.filter(s=>s.id!==id);localStorage.setItem('bgmi',JSON.stringify(bgSess));renderBGH();}
function renderBGH(){const el=document.getElementById('bg-hist');if(!el||!bgSess.length){if(el)el.innerHTML='';return;}el.innerHTML='<div style="font-family:var(--fm);font-size:.63rem;color:var(--mt);margin-bottom:6px;text-transform:uppercase;letter-spacing:1px;">Recent Sessions</div>'+bgSess.map(s=>'<div style="display:flex;justify-content:space-between;align-items:center;padding:7px 10px;border-radius:8px;background:rgba(239,68,68,.06);border:1px solid rgba(239,68,68,.2);font-family:var(--fm);font-size:.68rem;color:var(--mt);margin-bottom:5px;"><div>📅 '+s.date+' 🎮 '+s.m+'M 🏆 '+s.w+'W ☠️ '+s.k+'K</div><button onclick="delBG('+s.id+')" style="background:none;border:none;color:#ef4444;cursor:pointer;">✕</button></div>').join('');}
renderBGH();

// ── AMBIENT MUSIC ──
let audioCtx=null,musicOn=false,gainNd=null,oscs=[];
function createAmb(){audioCtx=new(AudioContext||webkitAudioContext)();gainNd=audioCtx.createGain();gainNd.gain.setValueAtTime(.04,audioCtx.currentTime);gainNd.connect(audioCtx.destination);[220,277.18,329.63,415.30].forEach((freq,i)=>{const o=audioCtx.createOscillator(),g=audioCtx.createGain();o.type='sine';o.frequency.setValueAtTime(freq,audioCtx.currentTime);g.gain.setValueAtTime(.3+i*.05,audioCtx.currentTime);o.connect(g);g.connect(gainNd);o.start();oscs.push(o);});}
function toggleMusic(){const btn=document.getElementById('music-btn');if(!musicOn){createAmb();btn.textContent='🔊';btn.classList.add('ply');musicOn=true;showToast('Ambient music ON 🎵');}else{oscs.forEach(o=>o.stop());oscs=[];if(audioCtx){audioCtx.close();audioCtx=null;}btn.textContent='🎵';btn.classList.remove('ply');musicOn=false;showToast('Music OFF 🔇');}}


// ================================================================
//  RESUME DOWNLOAD — fallback if resume.pdf not found
// ================================================================
function handleResumeDownload(e){
  // Try fetching resume.pdf first; if 404, generate text version
  fetch('resume.pdf',{method:'HEAD'}).then(r=>{
    if(!r.ok){
      e.preventDefault();
      // Generate a downloadable resume as HTML
      const resumeHTML=`<!DOCTYPE html><html><head><title>SIDHI — Resume</title>
<style>body{font-family:Arial,sans-serif;max-width:800px;margin:40px auto;color:#333;line-height:1.6;}
h1{color:#00d4ff;border-bottom:2px solid #00d4ff;padding-bottom:8px;}
h2{color:#7b2fff;margin-top:28px;}
.tag{display:inline-block;background:#e8f4f8;border-radius:4px;padding:2px 8px;margin:2px;font-size:13px;}
a{color:#00d4ff;}</style></head><body>
<h1>SIDHI</h1>
<p>📧 sidhi@example.com &nbsp;|&nbsp; 📱 Telegram: @SANATANI_BACHA &nbsp;|&nbsp; 🌐 <a href="https://github.com/SIDHIMUSIC">github.com/SIDHIMUSIC</a></p>
<p>📍 India 🇮🇳 &nbsp;|&nbsp; 🟢 Open to Work (Remote OK)</p>
<h2>About</h2>
<p>Aspiring Full-Stack Web Developer & Mathematics Educator with B.Ed background. Building educational tools and web applications that make learning accessible and engaging.</p>
<h2>Skills</h2>
<span class="tag">JavaScript 90%</span><span class="tag">HTML/CSS 95%</span><span class="tag">Python 75%</span><span class="tag">React 70%</span><span class="tag">Node.js 65%</span><span class="tag">Three.js 60%</span><span class="tag">Git/GitHub 85%</span><span class="tag">Math Education 95%</span>
<h2>Projects</h2>
<p><strong>SIDHI Music Hub</strong> — Full-stack music platform with streaming, playlists & real-time sync. (Node.js, React, WebAudio)</p>
<p><strong>Dev Portfolio v3</strong> — This portfolio with Three.js particles, 22+ tools & Scientific Math Solver.</p>
<p><strong>Scientific Math Solver</strong> — Educational math tool for students — algebra, calculus, geometry & statistics.</p>
<h2>Education</h2>
<p><strong>B.Ed (Bachelor of Education)</strong> — Mathematics Specialization</p>
<h2>Links</h2>
<p>GitHub: <a href="https://github.com/SIDHIMUSIC">github.com/SIDHIMUSIC</a></p>
<p>Instagram: <a href="https://instagram.com/harryashu_">@harryashu_</a> · 990 followers</p>
</body></html>`;
      const blob=new Blob([resumeHTML],{type:'text/html'});
      const url=URL.createObjectURL(blob);
      const a=document.createElement('a');a.href=url;a.download='SIDHI_Resume.html';a.click();
      URL.revokeObjectURL(url);
      showToast('📄 Resume downloaded! (Replace resume.pdf with your actual PDF)');
    }
  }).catch(()=>{
    e.preventDefault();
    showToast('⚠️ Place your resume.pdf in the same folder!');
  });
}

// ── FOOTER ──
document.getElementById('f-yr').textContent=new Date().getFullYear();

// ================================================================
//  GITHUB STATS
// ================================================================
(async()=>{
  const LANG_COLORS={JavaScript:'#f1e05a',Python:'#3572A5',HTML:'#e34c26',CSS:'#563d7c',TypeScript:'#2b7489',Shell:'#89e051',Jupyter:'#DA5B0B',Vue:'#41b883',Svelte:'#ff3e00'};
  try{
    // User stats
    const ur=await fetch('https://api.github.com/users/SIDHIMUSIC');
    if(!ur.ok)throw new Error();
    const u=await ur.json();
    document.getElementById('gh-repos').textContent=u.public_repos||0;
    document.getElementById('gh-followers').textContent=u.followers||0;

    // Repos for stars/forks/languages
    const rr=await fetch('https://api.github.com/users/SIDHIMUSIC/repos?per_page=100');
    if(!rr.ok)throw new Error();
    const repos=await rr.json();
    const stars=repos.reduce((a,r)=>a+r.stargazers_count,0);
    const forks=repos.reduce((a,r)=>a+r.forks_count,0);
    document.getElementById('gh-stars').textContent=stars;
    document.getElementById('gh-forks').textContent=forks;

    // Language breakdown
    const langMap={};
    await Promise.all(repos.slice(0,20).map(async r=>{
      try{
        const lr=await fetch(r.languages_url);
        if(!lr.ok)return;
        const langs=await lr.json();
        Object.entries(langs).forEach(([l,b])=>{langMap[l]=(langMap[l]||0)+b;});
      }catch(e){}
    }));
    const total=Object.values(langMap).reduce((a,b)=>a+b,0)||1;
    const sorted=Object.entries(langMap).sort((a,b)=>b[1]-a[1]).slice(0,6);
    const lb=document.getElementById('lang-bars');
    lb.innerHTML='';
    sorted.forEach(([lang,bytes])=>{
      const pct=((bytes/total)*100).toFixed(1);
      const col=LANG_COLORS[lang]||'#8b949e';
      const row=document.createElement('div');
      row.className='lang-row';
      row.innerHTML=`<div class="lang-name">${lang}</div>
        <div class="lang-bar-wrap"><div class="lang-bar-fill" style="width:0;background:${col}" data-w="${pct}"></div></div>
        <div class="lang-pct">${pct}%</div>`;
      lb.appendChild(row);
    });
    // Animate bars
    setTimeout(()=>{document.querySelectorAll('.lang-bar-fill').forEach(b=>{b.style.width=b.dataset.w+'%';});},200);

  }catch(e){
    ['gh-repos','gh-stars','gh-forks','gh-followers'].forEach(id=>{const el=document.getElementById(id);if(el)el.textContent='N/A';});
    const lb=document.getElementById('lang-bars');
    if(lb)lb.innerHTML='<div style="font-family:var(--fm);font-size:.68rem;color:var(--mt);">Could not load. <a href="https://github.com/SIDHIMUSIC" target="_blank" style="color:var(--p)">View on GitHub →</a></div>';
  }

  // Simulated contribution grid (12 weeks x 7 days)
  const cg=document.getElementById('contrib-grid');
  if(cg){
    const levels=['rgba(255,255,255,.05)','rgba(0,212,255,.15)','rgba(0,212,255,.35)','rgba(0,212,255,.75)','#00d4ff'];
    // Generate semi-realistic data weighted towards recent
    for(let w=11;w>=0;w--){
      for(let d=0;d<7;d++){
        const base=Math.random();
        const recency=(12-w)/12;
        const val=base*recency;
        let lvl=0;
        if(val>.7)lvl=4;else if(val>.5)lvl=3;else if(val>.3)lvl=2;else if(val>.15)lvl=1;
        // Some days have 0 (weekends more likely)
        if((d===0||d===6)&&Math.random()>.4)lvl=0;
        const cell=document.createElement('div');
        cell.className='contrib-cell';
        cell.style.background=levels[lvl];
        cell.title=(lvl===0?'No':'Some')+' contributions';
        cg.appendChild(cell);
      }
    }
  }
})();

// ================================================================
//  CONTACT FORM (Formspree)
// ================================================================
document.getElementById('contact-form').addEventListener('submit',async function(e){
  e.preventDefault();
  const btn=document.getElementById('cf-submit'),status=document.getElementById('cf-status');
  btn.disabled=true;btn.textContent='⏳ Sending...';status.textContent='';status.className='cf-status';
  const data=new FormData(this);
  try{
    // Replace 'YOUR_FORM_ID' with your Formspree form ID at formspree.io
    const res=await fetch('https://formspree.io/f/YOUR_FORM_ID',{method:'POST',body:data,headers:{'Accept':'application/json'}});
    if(res.ok){
      status.textContent='✅ Message sent! I Will reply within 24hrs 🚀';
      status.classList.add('cf-ok');
      this.reset();
      showToast('Message sent! ✅');
    }else{
      throw new Error();
    }
  }catch(err){
    status.textContent='⚠️ Could not send. Email me directly: sidhi@example.com';
    status.classList.add('cf-err');
  }
  btn.disabled=false;btn.textContent='🚀 Send Message';
});

// ================================================================
//  SCIENTIFIC MATH SOLVER JS
// ================================================================
function showMT(id,btn){document.querySelectorAll('#t-math .c-sub').forEach(p=>p.classList.remove('on'));document.querySelectorAll('#math-tabs .pm-btn').forEach(b=>b.classList.remove('on'));document.getElementById(id).classList.add('on');btn.classList.add('on');}
function showGT(id,btn){document.querySelectorAll('#m-geo .c-sub').forEach(p=>p.classList.remove('on'));document.querySelectorAll('#geo-tabs .pm-btn').forEach(b=>b.classList.remove('on'));document.getElementById(id).classList.add('on');btn.classList.add('on');}
function mInsert(v){const i=document.getElementById('m-expr');i.value+=v;i.focus();}

function solveBasic(){
  let ex=document.getElementById('m-expr').value.trim();
  const res=document.getElementById('m-basic-res'),steps=document.getElementById('m-basic-steps');
  if(!ex){res.style.display='none';return;}
  try{
    // Pre-process: sqrt→Math.sqrt, log→Math.log10, ln→Math.log, ^→**, π→Math.PI
    let expr=ex
      .replace(/√\(/g,'Math.sqrt(')
      .replace(/sqrt\(/gi,'Math.sqrt(')
      .replace(/log\(/gi,'Math.log10(')
      .replace(/ln\(/gi,'Math.log(')
      .replace(/\^/g,'**')
      .replace(/π/g,'Math.PI')
      .replace(/sin\(/gi,'Math.sin(')
      .replace(/cos\(/gi,'Math.cos(')
      .replace(/tan\(/gi,'Math.tan(');
    const ans=Function('"use strict";return('+expr+')')();
    const rounded=Math.round(ans*1e10)/1e10;
    res.style.display='block';
    res.textContent='= '+rounded;
    res.style.color='var(--p)';
    steps.style.display='block';
    steps.innerHTML='<b style="color:var(--s)">📋 Solution Steps:</b><br>'
      +'Expression: '+ex+'<br>'
      +'Processed: '+expr+'<br>'
      +'Result: <b style="color:var(--p)">'+rounded+'</b>'
      +(Number.isInteger(rounded)?'':('<br>Fraction ≈ '+rounded.toFixed(4)));
  }catch(e){res.style.display='block';res.textContent='⚠️ Invalid expression!';res.style.color='var(--a)';steps.style.display='none';}
}

function solveQuad(){
  const a=parseFloat(document.getElementById('qa').value),b=parseFloat(document.getElementById('qb').value),c=parseFloat(document.getElementById('qc').value);
  const res=document.getElementById('m-alg-res'),steps=document.getElementById('m-alg-steps');
  if(isNaN(a)||isNaN(b)||isNaN(c)){return;}
  const D=b*b-4*a*c;
  res.style.display='block';steps.style.display='block';
  steps.innerHTML='<b style="color:var(--s)">📋 Quadratic Formula: x = (-b ± √(b²-4ac)) / 2a</b><br>'
    +'a='+a+', b='+b+', c='+c+'<br>'
    +'Discriminant D = b²-4ac = '+b+'²-4×'+a+'×'+c+' = <b style="color:var(--p)">'+D+'</b><br>';
  if(D>0){
    const x1=((-b+Math.sqrt(D))/(2*a)).toFixed(4),x2=((-b-Math.sqrt(D))/(2*a)).toFixed(4);
    res.innerHTML='x₁ = '+x1+'<br>x₂ = '+x2+'<br><span style="font-size:.65rem;color:var(--mt)">Two real roots ✅</span>';
    steps.innerHTML+='D > 0 → Two distinct real roots<br>x₁ = (-'+b+'+√'+D+') / '+2*a+' = <b>'+x1+'</b><br>x₂ = (-'+b+'-√'+D+') / '+2*a+' = <b>'+x2+'</b>';
  }else if(D===0){
    const x=((-b)/(2*a)).toFixed(4);
    res.innerHTML='x = '+x+'<br><span style="font-size:.65rem;color:var(--mt)">One real root (repeated) ✅</span>';
    steps.innerHTML+='D = 0 → Equal roots<br>x = -b/2a = -'+b+'/'+(2*a)+' = <b>'+x+'</b>';
  }else{
    const re=((-b)/(2*a)).toFixed(4),im=(Math.sqrt(-D)/(2*a)).toFixed(4);
    res.innerHTML='x₁ = '+re+' + '+im+'i<br>x₂ = '+re+' - '+im+'i<br><span style="font-size:.65rem;color:var(--a)">Complex roots ⚠️</span>';
    steps.innerHTML+='D < 0 → Complex/Imaginary roots<br>Real part = -b/2a = <b>'+re+'</b><br>Imaginary part = √|D|/2a = <b>'+im+'i</b>';
  }
}

function solveTrig(){
  const a=parseFloat(document.getElementById('trig-a').value),u=document.getElementById('trig-u').value;
  if(isNaN(a))return;
  const rad=u==='deg'?a*Math.PI/180:a;
  const fmt=v=>Math.abs(v)<1e-10?'0':isFinite(v)?Math.round(v*10000)/10000:'undefined';
  document.getElementById('t-sin').textContent=fmt(Math.sin(rad));
  document.getElementById('t-cos').textContent=fmt(Math.cos(rad));
  document.getElementById('t-tan').textContent=fmt(Math.tan(rad));
  document.getElementById('t-csc').textContent=fmt(1/Math.sin(rad));
  document.getElementById('t-sec').textContent=fmt(1/Math.cos(rad));
  document.getElementById('t-cot').textContent=fmt(Math.cos(rad)/Math.sin(rad));
  document.getElementById('m-trig-res').style.display='grid';
}

function solveStat(){
  const nums=document.getElementById('stat-i').value.split(',').map(n=>parseFloat(n.trim())).filter(n=>!isNaN(n));
  if(!nums.length)return;
  const n=nums.length,sorted=[...nums].sort((a,b)=>a-b);
  const mean=nums.reduce((a,b)=>a+b,0)/n;
  const median=n%2===0?(sorted[n/2-1]+sorted[n/2])/2:sorted[Math.floor(n/2)];
  const freq={};nums.forEach(x=>{freq[x]=(freq[x]||0)+1;});
  const maxFreq=Math.max(...Object.values(freq));
  const mode=Object.entries(freq).filter(([,v])=>v===maxFreq).map(([k])=>k).join(', ');
  const range=sorted[n-1]-sorted[0];
  const variance=nums.reduce((a,b)=>a+(b-mean)**2,0)/n;
  const sd=Math.sqrt(variance);
  const fmt=v=>(Math.round(v*100)/100).toString();
  document.getElementById('s-mean').textContent=fmt(mean);
  document.getElementById('s-med').textContent=fmt(median);
  document.getElementById('s-mode').textContent=mode;
  document.getElementById('s-range').textContent=fmt(range);
  document.getElementById('s-sd').textContent=fmt(sd);
  document.getElementById('s-var').textContent=fmt(variance);
  document.getElementById('s-min').textContent=sorted[0];
  document.getElementById('s-max').textContent=sorted[n-1];
  document.getElementById('m-stat-res').style.display='grid';
}

// Geometry
function geoCircle(){const r=parseFloat(document.getElementById('g-cr').value);if(isNaN(r)||r<=0){document.getElementById('g-circle-res').style.display='none';return;}const fmt=v=>(Math.round(v*100)/100);document.getElementById('g-ca').textContent=fmt(Math.PI*r*r);document.getElementById('g-cc').textContent=fmt(2*Math.PI*r);document.getElementById('g-cd').textContent=fmt(2*r);document.getElementById('g-cs').textContent=fmt(Math.PI*r*r/2);document.getElementById('g-circle-res').style.display='grid';}
function geoTri(){const a=parseFloat(document.getElementById('g-ta').value),b=parseFloat(document.getElementById('g-tb').value),c=parseFloat(document.getElementById('g-tc').value);if(isNaN(a)||isNaN(b)||isNaN(c))return;const s=(a+b+c)/2;const areaVal=Math.sqrt(s*(s-a)*(s-b)*(s-c));const fmt=v=>isNaN(v)?'Invalid':Math.round(v*100)/100;const t=a===b&&b===c?'Equilateral':a===b||b===c||a===c?'Isosceles':'Scalene';document.getElementById('g-tarea').textContent=fmt(areaVal);document.getElementById('g-tper').textContent=fmt(a+b+c);document.getElementById('g-tsp').textContent=fmt(s);document.getElementById('g-ttype').textContent=t;document.getElementById('g-tri-res').style.display='grid';}
function geoRect(){const l=parseFloat(document.getElementById('g-rl').value),w=parseFloat(document.getElementById('g-rw').value);if(isNaN(l)||isNaN(w))return;document.getElementById('g-ra').textContent=Math.round(l*w*100)/100;document.getElementById('g-rp').textContent=2*(l+w);document.getElementById('g-rd').textContent=Math.round(Math.sqrt(l*l+w*w)*100)/100;document.getElementById('g-rs').textContent=l===w?'Yes ✅':'No';document.getElementById('g-rect-res').style.display='grid';}
function geoSphere(){const r=parseFloat(document.getElementById('g-sr').value);if(isNaN(r)||r<=0)return;const fmt=v=>Math.round(v*100)/100;document.getElementById('g-sv').textContent=fmt(4/3*Math.PI*r**3);document.getElementById('g-ssa').textContent=fmt(4*Math.PI*r**2);document.getElementById('g-sphere-res').style.display='grid';}

function openGamingWorld(){
  document.getElementById('gw-overlay').classList.add('open');
  document.body.style.overflow='hidden';
  // animate skill bars
  setTimeout(function(){
    document.querySelectorAll('.ff-bar-fill').forEach(function(b){
      b.style.width=b.dataset.w+'%';
    });
  }, 300);
}
function closeGamingWorld(){
  document.getElementById('gw-overlay').classList.remove('open');
  document.body.style.overflow='';
  // reset bars for next open
  document.querySelectorAll('.ff-bar-fill').forEach(function(b){b.style.width='0';});
}
function ffCopyUID(){
  var uid=document.getElementById('ff-uid-val').textContent;
  navigator.clipboard.writeText(uid)
    .then(function(){showToast('FF UID Copied: '+uid+' \u2705');})
    .catch(function(){showToast('UID: '+uid);});
}
document.addEventListener('keydown',function(e){if(e.key==='Escape')closeGamingWorld();});

// ================================================================
//  IMAGE TO BASE64
// ================================================================
function img64Convert(input){
  const file=input.files[0];
  if(!file)return;
  const reader=new FileReader();
  reader.onload=function(e){
    const b64=e.target.result;
    const pureB64=b64.split(',')[1];
    document.getElementById('img64-img').src=b64;
    document.getElementById('img64-out').value=pureB64;
    const kb=(file.size/1024).toFixed(1);
    const b64kb=(pureB64.length*0.75/1024).toFixed(1);
    document.getElementById('img64-info').textContent=`📄 ${file.name} | ${kb} KB | Type: ${file.type} | Base64 size: ~${b64kb} KB`;
    document.getElementById('img64-preview').style.display='block';
    showToast('Base64 ready! ✅');
  };
  reader.readAsDataURL(file);
}
function img64Copy(){
  const v=document.getElementById('img64-out').value;
  if(!v){showToast('Pehle image upload karo! 📸');return;}
  navigator.clipboard.writeText(v).then(()=>showToast('Base64 copied! ✅'));
}
function img64CopyFull(){
  const img=document.getElementById('img64-img');
  const v=img.src;
  if(!v||v===window.location.href){showToast('Pehle image upload karo! 📸');return;}
  navigator.clipboard.writeText(v).then(()=>showToast('Full Data URL copied! ✅'));
}
function img64Clear(){
  document.getElementById('img64-inp').value='';
  document.getElementById('img64-preview').style.display='none';
  document.getElementById('img64-out').value='';
  showToast('Cleared 🗑️');
}

// Drag & drop support
(()=>{
  const label=document.querySelector('label[for="img64-inp"]');
  if(!label)return;
  label.addEventListener('dragover',e=>{e.preventDefault();label.style.borderColor='var(--p)';label.style.background='rgba(0,212,255,.05)';});
  label.addEventListener('dragleave',()=>{label.style.borderColor='';label.style.background='';});
  label.addEventListener('drop',e=>{
    e.preventDefault();label.style.borderColor='';label.style.background='';
    const file=e.dataTransfer.files[0];
    if(file&&file.type.startsWith('image/')){
      const inp=document.getElementById('img64-inp');
      const dt=new DataTransfer();dt.items.add(file);inp.files=dt.files;
      img64Convert(inp);
    }
  });
})();

// ================================================================
//  IP & NETWORK INFO
// ================================================================
async function fetchIPInfo(){
  const btn=document.getElementById('ip-fetch-btn');
  const loading=document.getElementById('ip-loading');
  const res=document.getElementById('ip-res');
  btn.style.display='none';
  loading.style.display='block';
  res.style.display='none';
  try{
    const r=await fetch('https://ipapi.co/json/');
    const d=await r.json();
    document.getElementById('ip-addr').textContent=d.ip||'—';
    document.getElementById('ip-city').textContent=d.city||'—';
    document.getElementById('ip-region').textContent=d.region||'—';
    document.getElementById('ip-country').textContent=(d.country_name||'—')+' '+((d.country_code==='IN')?'🇮🇳':(d.country_code||''));
    document.getElementById('ip-loc').textContent=d.latitude+', '+d.longitude;
    document.getElementById('ip-tz').textContent=d.timezone||'—';
    document.getElementById('ip-org').textContent=d.org||'—';
    loading.style.display='none';
    res.style.display='grid';
    showToast('IP Info mila! 🌐');
  }catch(e){
    loading.style.display='none';
    btn.style.display='block';
    btn.textContent='❌ Failed — Dobara try karo';
    showToast('Error aaya, try again 😅');
  }
}

// ================================================================
//  TYPING SPEED TEST
// ================================================================
const TYPING_TEXTS={
  easy:['the quick brown fox jumps over the lazy dog','practice makes a man perfect and consistency is key','learning to type fast is a very useful skill in life','hard work and dedication always lead to great results','every day is a new chance to improve yourself and grow'],
  medium:['success is not final failure is not fatal it is the courage to continue that counts','the only way to do great work is to love what you do and never stop learning new things','in the middle of every difficulty lies opportunity if you look hard enough for it','technology is best when it brings people together and makes their lives easier and better','discipline is choosing between what you want now and what you want most in life'],
  hard:['asynchronous programming requires understanding of callbacks promises and async await patterns in javascript','the implementation of binary search algorithms requires careful consideration of edge cases and boundary conditions','cryptographic hash functions like SHA-256 produce fixed-length outputs regardless of input size or complexity','refactoring legacy codebases demands meticulous attention to unit tests regression testing and documentation standards','polymorphism encapsulation inheritance and abstraction are the four fundamental principles of object-oriented programming'],
  code:['const arr = [1,2,3].map(x => x * 2).filter(n => n > 2);','async function fetchData(url) { const res = await fetch(url); return res.json(); }','document.querySelectorAll(".btn").forEach(el => el.addEventListener("click", handler));','const { name, age = 18 } = user ?? { name: "Guest", age: 0 };','git commit -m "feat: add typing speed test with WPM tracker" --no-verify']
};

let typingMode='easy', typingStart=null, typingTimer=null, typingDone=false, typingErrors=0, typingTarget='';

function typingSetMode(mode,btn){
  typingMode=mode;
  document.querySelectorAll('#t-typing .pm-btn').forEach(b=>b.classList.remove('on'));
  btn.classList.add('on');
  typingReset();
}

function typingReset(){
  clearInterval(typingTimer);
  typingStart=null; typingDone=false; typingErrors=0;
  const pool=TYPING_TEXTS[typingMode];
  typingTarget=pool[Math.floor(Math.random()*pool.length)];
  renderTypingText('');
  const inp=document.getElementById('typing-inp');
  inp.value=''; inp.style.borderColor='var(--border)';
  inp.disabled=false; inp.placeholder='Yahan type karo — test shuru ho jaayega...';
  document.getElementById('t-wpm').textContent='—';
  document.getElementById('t-acc').textContent='—';
  document.getElementById('t-elapsed').textContent='—';
  document.getElementById('t-errs').textContent='—';
  document.getElementById('typing-result').style.display='none';
}

function renderTypingText(typed){
  const el=document.getElementById('typing-text');
  let html='';
  for(let i=0;i<typingTarget.length;i++){
    if(i<typed.length){
      if(typed[i]===typingTarget[i]) html+=`<span style="color:var(--p)">${typingTarget[i]}</span>`;
      else html+=`<span style="color:var(--a);text-decoration:underline;">${typingTarget[i]}</span>`;
    } else if(i===typed.length){
      html+=`<span style="background:var(--p);color:var(--bg);border-radius:2px;">${typingTarget[i]}</span>`;
    } else {
      html+=`<span>${typingTarget[i]}</span>`;
    }
  }
  el.innerHTML=html;
}

function typingCheck(){
  if(typingDone)return;
  const inp=document.getElementById('typing-inp');
  const typed=inp.value;
  if(!typingStart&&typed.length>0){
    typingStart=Date.now();
    typingTimer=setInterval(()=>{
      const sec=((Date.now()-typingStart)/1000).toFixed(1);
      document.getElementById('t-elapsed').textContent=sec+'s';
      const words=document.getElementById('typing-inp').value.trim().split(/\s+/).filter(Boolean).length;
      const wpm=Math.round(words/(sec/60));
      document.getElementById('t-wpm').textContent=wpm||0;
    },200);
  }
  renderTypingText(typed);
  let errs=0;
  for(let i=0;i<typed.length;i++) if(typed[i]!==typingTarget[i]) errs++;
  typingErrors=errs;
  document.getElementById('t-errs').textContent=errs;
  const correct=typed.split('').filter((c,i)=>c===typingTarget[i]).length;
  const acc=typed.length>0?Math.round(correct/typed.length*100):100;
  document.getElementById('t-acc').textContent=acc+'%';
  inp.style.borderColor=errs>0?'var(--a)':'rgba(0,212,255,.4)';
  if(typed===typingTarget) typingFinish(typed);
}

function typingKeyDown(e){
  if(e.key==='Tab'){e.preventDefault();typingReset();}
}

function typingFinish(typed){
  typingDone=true;
  clearInterval(typingTimer);
  const sec=(Date.now()-typingStart)/1000;
  const words=typed.trim().split(/\s+/).length;
  const wpm=Math.round(words/(sec/60));
  const correct=typed.split('').filter((c,i)=>c===typingTarget[i]).length;
  const acc=Math.round(correct/typed.length*100);
  document.getElementById('t-wpm').textContent=wpm;
  document.getElementById('t-acc').textContent=acc+'%';
  document.getElementById('t-elapsed').textContent=sec.toFixed(1)+'s';
  document.getElementById('t-errs').textContent=typingErrors;
  const grade=wpm>=80?'🏆 Pro Typer!':wpm>=60?'🔥 Fast!':wpm>=40?'👍 Average':wpm>=20?'🙂 Keep Practicing':'💪 Beginner — Practice karo!';
  const res=document.getElementById('typing-result');
  res.style.display='block';
  res.innerHTML=`✅ Done! &nbsp;|&nbsp; <b style="color:var(--p)">${wpm} WPM</b> &nbsp;|&nbsp; Accuracy: <b style="color:#00ff88">${acc}%</b> &nbsp;|&nbsp; ${grade}<br><span style="font-size:.65rem;color:var(--mt)">Tab dabao ya button se naya test shuru karo</span>`;
  document.getElementById('typing-inp').disabled=true;
  showToast(grade+' — '+wpm+' WPM 🎯');
}

document.addEventListener('DOMContentLoaded',()=>{typingReset();});
