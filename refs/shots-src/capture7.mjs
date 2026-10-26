import { chromium } from 'playwright-core'; import fs from 'fs';
const OUT='../shots-out'; fs.mkdirSync(OUT,{recursive:true});
const b=await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
const U='http://localhost:8124/stage.html';
async function fresh(dpr){const c=await b.newContext({viewport:{width:760,height:520},deviceScaleFactor:dpr,colorScheme:'light'});const p=await c.newPage();await p.goto(U,{waitUntil:'networkidle'});await p.waitForTimeout(1200);return p;}
const fitF=async(p)=>{const h=await p.frameLocator('#popup').locator('main').evaluate(e=>e.offsetHeight);await p.evaluate(h=>document.getElementById('popup').style.height=h+'px',h);};
const wait=ms=>new Promise(r=>setTimeout(r,ms));
// ---- stills at 2x
{
 const p=await fresh(2); const f=p.frameLocator('#popup');
 const shoot=async n=>{await p.waitForTimeout(250);await fitF(p);await p.screenshot({path:`${OUT}/chrome-${n}.png`});await p.locator('#popup').screenshot({path:`${OUT}/popup-${n}.png`});};
 await shoot('1-locked');
 await f.locator('input').fill('KEYTURN-DEMO-2026'); await shoot('2-key-typed');
 await f.getByRole('button',{name:'Activate'}).click(); await p.waitForTimeout(1300); await shoot('3-pro-on');
 console.log('pro text:',(await f.locator('body').innerText()).replace(/\n+/g,' | '));
 const q=await fresh(2); const g=q.frameLocator('#popup');
 await g.locator('input').fill('WRONG-KEY-1234'); await g.getByRole('button',{name:'Activate'}).click(); await q.waitForTimeout(1300);
 await q.waitForTimeout(250); await fitF(q); await q.screenshot({path:`${OUT}/chrome-4-wrong-key.png`}); await q.locator('#popup').screenshot({path:`${OUT}/popup-4-wrong-key.png`});
 console.log('error text:',(await g.locator('body').innerText()).replace(/\n+/g,' | '));
}
// ---- GIF frames at 1x
{
 fs.rmSync(OUT+'/frames',{recursive:true,force:true}); fs.mkdirSync(OUT+'/frames');
 const p=await fresh(1); const f=p.frameLocator('#popup'); const list=[]; let n=0;
 const snap=async(ms)=>{await fitF(p);const name=`f${String(n++).padStart(3,'0')}.png`;await p.screenshot({path:`${OUT}/frames/${name}`});list.push([name,ms]);};
 const cur=async(x,y)=>{await p.evaluate(([x,y])=>{const c=document.getElementById('cur');c.style.display='block';c.style.left=x+'px';c.style.top=y+'px'},[x,y]);await p.mouse.move(x,y);};
 const inp=await f.locator('input').boundingBox(), btn=await f.getByRole('button',{name:'Activate'}).boundingBox();
 const ip=[inp.x+inp.width*0.6,inp.y+inp.height/2], bp=[btn.x+btn.width/2,btn.y+btn.height/2];
 await snap(1100);
 let a=[560,430]; const move=async(from,to,steps,ms)=>{for(let i=1;i<=steps;i++){const t=i/steps,e=t*t*(3-2*t);await cur(from[0]+(to[0]-from[0])*e,from[1]+(to[1]-from[1])*e);await snap(ms);}};
 await move(a,ip,6,70);
 await p.mouse.click(ip[0],ip[1]); await snap(250);
 const key='KEYTURN-DEMO-2026';
 for(let i=1;i<=key.length;i++){await f.locator('input').fill(key.slice(0,i));await snap(110);}
 await snap(450);
 await move(ip,bp,5,70);
 await p.mouse.down(); await snap(90); await p.mouse.up();
 for(let i=0;i<7;i++){await wait(90);await snap(90);}
 await wait(500); await snap(2400);
 fs.writeFileSync(OUT+'/frames.txt',list.map(([n,ms])=>`file 'frames/${n}'\nduration ${ms/1000}`).join('\n')+`\nfile 'frames/${list[list.length-1][0]}'\n`);
 console.log('frames',list.length,'total s',list.reduce((s,x)=>s+x[1],0)/1000);
}
await b.close();
