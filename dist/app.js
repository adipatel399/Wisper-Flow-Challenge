'use strict';
const $=s=>document.querySelector(s);
const stories={health:{label:'01 / HEALTH.AI',title:'Making symptoms<br>easier to navigate.',intro:'A full-stack health information project that combines natural-language processing, semantic retrieval, and a usable interface.',sections:[['The build','I paired a fine-tuned MiniLM encoder with an ensemble classifier, achieving 88.7% top-1 accuracy in project evaluation. That result describes the evaluated classification task, not clinical accuracy.'],['Beyond classification','Semantic retrieval and triage flag emergencies outside the trained label set. The Flask + React application also includes diet plans, calendar reminders, and a pharmacy locator.'],['The engineering question','How do you turn an uncertain language input into a useful experience? This project brings model behavior, retrieval, and interface design into the same workflow.']],links:[['View project','https://health-ai-xck8.onrender.com/'],['Explore the code','https://github.com/adipatel399/Health.AI']],note:'Personal project for health information. It is not a medical diagnosis service or a substitute for professional care.'},bnp:{label:'02 / BNP PARIBAS · JAN–JUL 2026',title:'Working through<br>enterprise complexity.',intro:'As an AI Engineer Intern in Mumbai, I worked on automation, retrieval, and workflow reliability.',sections:[['The work','I developed Playwright MCP automation to validate complex user workflows, and implemented RAG workflows using LangChain and vector databases for semantic search across 10,000+ documents.'],['The result','My résumé reports a 30% reduction in manual effort for the AI-driven workflows I worked on. I also used AI agents and LoadRunner for testing and performance analysis.'],['What this shows','The work connects AI development to operational usefulness: finding information, validating workflows, and reducing repetitive tasks.']],links:[['Connect on LinkedIn','https://www.linkedin.com/in/aditya399/']],note:'Internship summary based on my résumé. Internal code, documents, and confidential implementation details are not published.'},rocky:{label:'03 / ROCKY',title:'A companion.<br>A voice.<br>A working system.',intro:'A voice-controlled macOS companion inspired by Rocky from Project Hail Mary.',sections:[['Local by design','Wake-word detection and speech-to-text run on the machine using openWakeWord and Whisper. Listening and transcription stay local; other application capabilities may use external services.'],['A faster route','For supported live-data queries, a direct intent-to-provider router bypasses the LLM. My project reports replies in about one second for those queries.'],['A spatial interface','A three-dimensional globe flies to locations and surfaces weather, news, and Wikipedia information. The stack includes Python, FastAPI, JavaScript, three.js, and globe.gl.']],links:[['Explore the code','https://github.com/adipatel399/Rocky']],note:'Existing project showcased in this newly built portfolio.'}};
function openStory(id){const s=stories[id];if(!s)return;$('#story-content').innerHTML=`<div class="section-label">${s.label}</div><h2>${s.title}</h2><p>${s.intro}</p>${s.sections.map(([h,p])=>`<h3>${h}</h3><p>${p}</p>`).join('')}<div class="links">${s.links.map(([t,u])=>`<a href="${u}" target="_blank" rel="noopener">${t} ↗</a>`).join('')}</div><p class="note">${s.note}</p>`;if(running&&!paused)pauseGame();$('#story-dialog').showModal()}
document.querySelectorAll('[data-story]').forEach(b=>b.addEventListener('click',()=>openStory(b.dataset.story)));$('.close').onclick=()=>$('#story-dialog').close();$('#story-dialog').addEventListener('click',e=>{if(e.target===$('#story-dialog')){const r=e.target.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)e.target.close()}});
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
const orb=$('#orb'),oc=orb.getContext('2d');let ow=0,oh=0,rotation=0,tilt=.4,drag=false,px=0;
function fit(c){const r=c.getBoundingClientRect(),d=Math.min(devicePixelRatio||1,2);c.width=Math.round(r.width*d);c.height=Math.round(r.height*d);c.getContext('2d').setTransform(d,0,0,d,0,0);return [r.width,r.height]}
function drawOrb(t){oc.clearRect(0,0,ow,oh);let angle=rotation+(reduced?0:t*.00016),scale=Math.min(ow,oh)*.31;const project=(u,v)=>{let a=1+.35*Math.cos(3*u),x=(a+.19*Math.cos(v))*Math.cos(2*u),z=(a+.19*Math.cos(v))*Math.sin(2*u),y=.55*Math.sin(3*u)+.19*Math.sin(v);let xx=x*Math.cos(angle)-z*Math.sin(angle),zz=x*Math.sin(angle)+z*Math.cos(angle);let yy=y*Math.cos(tilt)-zz*Math.sin(tilt),depth=y*Math.sin(tilt)+zz*Math.cos(tilt);let p=3.7/(3.7+depth);return [ow*.52+xx*scale*p,oh*.48+yy*scale*p,depth]};for(let v=0;v<24;v++){oc.beginPath();let dep=0;for(let u=0;u<=100;u++){const [x,y,z]=project(u/100*Math.PI*2,v/24*Math.PI*2);dep+=z;u?oc.lineTo(x,y):oc.moveTo(x,y)}oc.strokeStyle=`rgba(198,255,99,${.23+(1-dep/101)*.18})`;oc.lineWidth=.65;oc.stroke()}for(let u=0;u<64;u++){oc.beginPath();for(let v=0;v<=40;v++){const[x,y]=project(u/64*Math.PI*2,v/40*Math.PI*2);v?oc.lineTo(x,y):oc.moveTo(x,y)}oc.strokeStyle='#c6ff6355';oc.lineWidth=.65;oc.stroke()}oc.fillStyle='#c6ff63';oc.fillRect(ow*.52-2,oh*.48-2,4,4);requestAnimationFrame(drawOrb)}
orb.addEventListener('pointerdown',e=>{drag=true;px=e.clientX;orb.setPointerCapture(e.pointerId)});orb.addEventListener('pointermove',e=>{if(drag){rotation+=(e.clientX-px)*.012;px=e.clientX}});orb.addEventListener('pointerup',()=>drag=false);orb.addEventListener('pointercancel',()=>drag=false);
const game=$('#game'),ctx=game.getContext('2d');
let gw=0,gh=0,running=false,paused=false,lane=1,drawLane=1,score=0,lives=3,time=45,objects=[],elapsed=0,spawn=0,last=0,best=0,unlockTimer;
let particles=[],trail=[],streak=0,peakStreak=0,damage=0,invincible=0,bank=0,travel=0;
try{best=Number(localStorage.getItem('aditya-signal-best'))||0}catch{}
$('#best').textContent='BEST: '+String(best).padStart(2,'0');
function resize(){[ow,oh]=fit(orb);[gw,gh]=fit(game);trail=[]}
window.addEventListener('resize',resize);resize();requestAnimationFrame(drawOrb);
const ids=['health','bnp','rocky'];
function hud(){
 $('#score').textContent=String(score).padStart(2,'0');$('#lives').textContent='♥'.repeat(lives)+'♡'.repeat(3-lives);$('#time').textContent=Math.ceil(time);
 $('#game-status').textContent=paused?'PAUSED':running?'SECTOR '+String(Math.min(3,1+Math.floor(elapsed/15))).padStart(2,'0')+' / LIVE':'READY WHEN YOU ARE';
 $('#streak').textContent=streak>=2?streak+' SIGNAL STREAK':'STAY IN THE FLOW';
 $('#run-progress').style.width=Math.min(100,score/15*100)+'%';
}
function startGame(){
 running=true;paused=false;lane=1;drawLane=1;score=0;lives=3;time=45;objects=[];particles=[];trail=[];elapsed=0;spawn=.3;streak=0;peakStreak=0;damage=0;invincible=0;bank=0;travel=0;
 $('#game-overlay').style.display='none';$('.game-hud').hidden=false;$('#pause').disabled=false;$('#pause').textContent='Ⅱ';$('#pause').setAttribute('aria-label','Pause game');$('#unlock').style.opacity=0;clearTimeout(unlockTimer);
 document.querySelectorAll('#unlocks button').forEach(b=>b.disabled=true);hud();
}
function endGame(){
 running=false;paused=false;best=Math.max(best,score);try{localStorage.setItem('aditya-signal-best',best)}catch{}
 $('#best').textContent='BEST: '+String(best).padStart(2,'0');
 const won=lives>0;
 $('#game-overlay').innerHTML=`<span class="eyebrow">${won?'TRANSMISSION COMPLETE':'CONNECTION LOST'} / NICE FLIGHT</span><h3>${won?'SIGNAL':'RESET.'}<br><em>${won?'FOUND.':'REFLY.'}</em></h3><div class="run-results"><div><b>${String(score).padStart(2,'0')}</b><span>SIGNALS</span></div><div><b>${peakStreak}</b><span>BEST STREAK</span></div><div><b>${Math.min(3,Math.floor(score/5))}/3</b><span>STORIES</span></div></div><button class="pill light" id="play-again">Fly again <span>↗</span></button><small>${score>=5?'Your unlocked project stories are waiting below.':'Collect 5 signals to unlock the first project story.'}<br>All projects are also available in Selected Work.</small>`;
 $('#game-overlay').style.display='flex';$('#play-again').onclick=startGame;$('#pause').disabled=true;$('#game-status').textContent='RUN COMPLETE';
}
function pauseGame(){if(!running)return;paused=!paused;$('#pause').textContent=paused?'▶':'Ⅱ';$('#pause').setAttribute('aria-label',paused?'Resume game':'Pause game');$('#game-status').textContent=paused?'PAUSED / PRESS ▶ TO RESUME':'LIVE / FIND THE SIGNAL'}
function move(d){if(running&&!paused)lane=Math.max(0,Math.min(2,lane+d))}
$('#start-game').onclick=startGame;$('#restart').onclick=startGame;$('#pause').onclick=pauseGame;$('#left').onclick=()=>move(-1);$('#right').onclick=()=>move(1);
document.addEventListener('keydown',e=>{if($('#story-dialog').open||!running||/INPUT|TEXTAREA|SELECT/.test(e.target.tagName))return;if(['ArrowLeft','ArrowRight','a','A','d','D',' '].includes(e.key)){e.preventDefault();if(e.key===' '){if(!e.repeat)pauseGame()}else move(['ArrowLeft','a','A'].includes(e.key)?-1:1)}});
document.addEventListener('visibilitychange',()=>{if(document.hidden&&running&&!paused)pauseGame()});
let touchStart=null;
game.addEventListener('pointerdown',e=>{if(running&&!paused){touchStart={x:e.clientX,y:e.clientY};game.setPointerCapture(e.pointerId)}});
game.addEventListener('pointerup',e=>{if(touchStart){const dx=e.clientX-touchStart.x,dy=e.clientY-touchStart.y;if(Math.abs(dx)>22&&Math.abs(dx)>Math.abs(dy))move(dx>0?1:-1);touchStart=null}});
game.addEventListener('pointercancel',()=>touchStart=null);
function plane(l,z){const depth=1-z,scale=.055+depth*depth*.945;return [gw/2+(l-1)*gw*.255*scale,gh*.24+gh*.63*scale,scale]}
function burst(x,y,color,count){if(reduced)return;for(let i=0;i<count;i++){let a=i/count*Math.PI*2;particles.push({x,y,vx:Math.cos(a)*(40+Math.random()*100),vy:Math.sin(a)*(40+Math.random()*100),life:.55,max:.55,color})}}
function updateGame(dt){
 elapsed+=dt;travel+=dt;time=Math.max(0,45-elapsed);spawn-=dt;damage=Math.max(0,damage-dt*2);invincible=Math.max(0,invincible-dt);
 if(spawn<=0){spawn=Math.max(.48,.72-elapsed*.004);const sl=Math.floor(Math.random()*3);objects.push({lane:sl,z:1,type:'signal',hit:false});if(Math.random()<.65)objects.push({lane:(sl+1+Math.floor(Math.random()*2))%3,z:1,type:'noise',hit:false})}
 const previous=drawLane;drawLane+=(lane-drawLane)*(1-Math.exp(-dt*15));bank+=(Math.max(-1,Math.min(1,(drawLane-previous)*15))-bank)*Math.min(1,dt*12);
 for(const o of objects){o.z-=dt*(.24+elapsed*.0018);if(o.z<=.04&&!o.hit){o.hit=true;const[x,y]=plane(o.lane,.04);if(o.lane===lane){if(o.type==='signal'){
 score++;streak++;peakStreak=Math.max(streak,peakStreak);burst(x,y,'#c6ff63',18);
 if(score%5===0&&score<=15){const i=score/5-1;document.querySelectorAll('#unlocks button')[i].disabled=false;$('#unlock').textContent=stories[ids[i]].label+' UNLOCKED';$('#unlock').style.opacity=1;clearTimeout(unlockTimer);unlockTimer=setTimeout(()=>$('#unlock').style.opacity=0,2300)}
 }else if(invincible<=0){lives--;streak=0;damage=.65;invincible=.9;burst(x,y,'#ff8c78',22)}}else if(o.type==='signal'){streak=0}}}
 objects=objects.filter(o=>o.z>-.1);hud();if(time<=0||lives<=0)endGame();
}
function renderTrack(t){
 const horizon=gh*.24;const bg=ctx.createLinearGradient(0,0,0,gh);bg.addColorStop(0,'#080f0b');bg.addColorStop(.5,'#162216');bg.addColorStop(1,'#080f0b');ctx.fillStyle=bg;ctx.fillRect(0,0,gw,gh);
 const glow=ctx.createRadialGradient(gw/2,horizon,0,gw/2,horizon,gw*.55);glow.addColorStop(0,'#c6ff6320');glow.addColorStop(1,'#c6ff6300');ctx.fillStyle=glow;ctx.fillRect(0,0,gw,gh);
 // Distant stars and a quiet orbital beacon at the vanishing point.
 for(let i=0;i<44;i++){const x=((Math.sin(i*127.1)*43758.5453)%1+1)%1*gw,y=((Math.sin(i*311.7)*12345.67)%1+1)%1*horizon;ctx.fillStyle=i%4?'#b6d9ad35':'#e8ffe480';ctx.fillRect(x,y,i%4?1:2,1)}
 ctx.save();ctx.translate(gw/2,horizon);ctx.strokeStyle='#c6ff6328';for(let i=0;i<3;i++){ctx.beginPath();ctx.ellipse(0,0,gh*(.10+i*.027),gh*(.10+i*.027),0,Math.PI*1.02,Math.PI*1.98);ctx.stroke()}ctx.restore();
 // Three-lane road with glowing rails and moving transverse markers.
 ctx.fillStyle='#09130ee6';ctx.beginPath();ctx.moveTo(gw*.465,horizon);ctx.lineTo(gw*.535,horizon);ctx.lineTo(gw*.98,gh);ctx.lineTo(gw*.02,gh);ctx.closePath();ctx.fill();
 for(let edge=0;edge<=3;edge++){const l=edge-.5,[x0,y0]=plane(l,1),[x1]=plane(l,-.1);ctx.beginPath();ctx.moveTo(x0,y0);ctx.lineTo(x1,gh);ctx.strokeStyle=edge===0||edge===3?'#c6ff6380':'#9ebf7b25';ctx.lineWidth=edge===0||edge===3?2:1;ctx.stroke()}
 for(let i=0;i<22;i++){const z=1-((i/22+t*.22)%1),[xl,y,s]=plane(-.5,z),[xr]=plane(2.5,z);ctx.strokeStyle=`rgba(198,255,99,${s*.15})`;ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(xl,y);ctx.lineTo(xr,y);ctx.stroke();if(i%2===0){ctx.fillStyle='#d9ff9f';ctx.fillRect(xl-4*s,y,7*s,2*s);ctx.fillRect(xr-3*s,y,7*s,2*s)}}
 // Selected lane gives an immediate visual indication of steering.
 if(running){const[x]=plane(drawLane,0),grad=ctx.createLinearGradient(x,gh*.65,x,gh);grad.addColorStop(0,'#c6ff6300');grad.addColorStop(1,'#c6ff6315');ctx.fillStyle=grad;ctx.beginPath();ctx.moveTo(gw/2,horizon);ctx.lineTo(x-gw*.105,gh);ctx.lineTo(x+gw*.105,gh);ctx.closePath();ctx.fill()}
}
function renderObject(o,t){const[x,y,s]=plane(o.lane,o.z),size=Math.min(30,gw*.048)*s;ctx.save();ctx.translate(x,y);if(o.type==='signal'){
 ctx.translate(0,Math.sin(t*4+o.lane)*3*s);ctx.shadowColor='#c6ff63';ctx.shadowBlur=15*s;ctx.strokeStyle='#d6ff98';ctx.lineWidth=1.5;ctx.fillStyle='#c6ff6325';ctx.beginPath();ctx.moveTo(0,-size);ctx.lineTo(size*.65,0);ctx.lineTo(0,size);ctx.lineTo(-size*.65,0);ctx.closePath();ctx.fill();ctx.stroke();ctx.beginPath();ctx.moveTo(0,-size);ctx.lineTo(size*.2,0);ctx.lineTo(0,size);ctx.moveTo(-size*.65,0);ctx.lineTo(size*.65,0);ctx.stroke();ctx.fillStyle='#ecffd4';ctx.beginPath();ctx.arc(0,0,3*s,0,Math.PI*2);ctx.fill();
 }else{
 const w=size*1.2,h=size*.85,d=size*.35;ctx.fillStyle='#452822';ctx.strokeStyle='#ff8c78';ctx.lineWidth=1.3;ctx.beginPath();ctx.moveTo(-w,-h);ctx.lineTo(w,-h);ctx.lineTo(w,h);ctx.lineTo(-w,h);ctx.closePath();ctx.fill();ctx.stroke();ctx.fillStyle='#6a3a29';ctx.beginPath();ctx.moveTo(-w,-h);ctx.lineTo(-w+d,-h-d);ctx.lineTo(w+d,-h-d);ctx.lineTo(w,-h);ctx.fill();ctx.stroke();ctx.fillStyle='#211c18';ctx.beginPath();ctx.moveTo(w,-h);ctx.lineTo(w+d,-h-d);ctx.lineTo(w+d,h-d);ctx.lineTo(w,h);ctx.fill();ctx.stroke();ctx.strokeStyle='#ffc29c';ctx.beginPath();ctx.moveTo(-w*.4,-h*.4);ctx.lineTo(w*.4,h*.4);ctx.moveTo(w*.4,-h*.4);ctx.lineTo(-w*.4,h*.4);ctx.stroke();
 }ctx.restore()}
function renderShip(t,dt){const[x,y]=plane(drawLane,0),size=Math.min(25,gw*.05);
 if(!paused&&running&&!reduced){trail.push({x,y:y+size,life:1});if(trail.length>20)trail.shift()}
 trail.forEach((p,i)=>{ctx.fillStyle=`rgba(198,255,99,${i/trail.length*.2})`;ctx.beginPath();ctx.ellipse(p.x,p.y+(trail.length-i)*3,size*.2*(i/trail.length),7,0,0,Math.PI*2);ctx.fill()});
 ctx.save();ctx.translate(x,y);ctx.rotate(bank*.22);if(invincible>0)ctx.globalAlpha=.5+.5*Math.abs(Math.sin(t*20));
 const flame=size*(1.1+Math.sin(t*35)*.2);const fire=ctx.createLinearGradient(0,4,0,flame+size);fire.addColorStop(0,'#f2ffcf');fire.addColorStop(.35,'#c6ff63');fire.addColorStop(1,'#c6ff6300');ctx.fillStyle=fire;ctx.beginPath();ctx.moveTo(-size*.22,size*.4);ctx.lineTo(0,size+flame);ctx.lineTo(size*.22,size*.4);ctx.closePath();ctx.fill();
 ctx.shadowColor='#c6ff63';ctx.shadowBlur=18;ctx.fillStyle='#dfe9cf';ctx.strokeStyle='#f3ffe0';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(0,-size);ctx.lineTo(-size,size*.65);ctx.lineTo(0,size*.3);ctx.lineTo(size,size*.65);ctx.closePath();ctx.fill();ctx.stroke();ctx.shadowBlur=0;ctx.fillStyle='#526e45';ctx.beginPath();ctx.moveTo(0,-size*.7);ctx.lineTo(-size*.21,size*.25);ctx.lineTo(size*.21,size*.25);ctx.closePath();ctx.fill();ctx.strokeStyle='#c6ff63';ctx.beginPath();ctx.moveTo(-size*.75,size*.4);ctx.lineTo(-size*.35,size*.1);ctx.moveTo(size*.75,size*.4);ctx.lineTo(size*.35,size*.1);ctx.stroke();ctx.restore();
}
function drawGame(now){const dt=Math.min((now-last)/1000,.05)||0;last=now;if(running&&!paused)updateGame(dt);const t=running?travel:reduced?0:now*.00015;ctx.clearRect(0,0,gw,gh);renderTrack(t);
 objects.filter(o=>!o.hit).sort((a,b)=>b.z-a.z).forEach(o=>renderObject(o,t));
 if(running)renderShip(t,dt);
 particles.forEach(p=>{if(!paused){p.life-=dt;p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=160*dt}ctx.globalAlpha=Math.max(0,p.life/p.max);ctx.fillStyle=p.color;ctx.fillRect(p.x,p.y,3,3)});ctx.globalAlpha=1;particles=particles.filter(p=>p.life>0);
 if(damage>0&&!reduced){ctx.fillStyle=`rgba(255,110,85,${damage*.22})`;ctx.fillRect(0,0,gw,gh)}
 if(running&&paused){ctx.fillStyle='#07100ddd';ctx.fillRect(0,0,gw,gh);ctx.fillStyle='#c6ff63';ctx.font='32px Fraktion,monospace';ctx.textAlign='center';ctx.fillText('PAUSED',gw/2,gh/2);ctx.font='10px Fraktion,monospace';ctx.fillStyle='#c5d5b4';ctx.fillText('SPACE OR ▶ TO RESUME',gw/2,gh/2+30);ctx.textAlign='start'}requestAnimationFrame(drawGame)
}requestAnimationFrame(drawGame);

// Give the project previews a small physical response to the pointer.
if(!reduced && matchMedia('(hover:hover)').matches){document.querySelectorAll('.project-preview').forEach(card=>{card.addEventListener('pointermove',e=>{const r=card.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;card.style.setProperty('--rx',(-y*6)+'deg');card.style.setProperty('--ry',(x*6)+'deg')});card.addEventListener('pointerleave',()=>{card.style.setProperty('--rx','0deg');card.style.setProperty('--ry','0deg')})})}
