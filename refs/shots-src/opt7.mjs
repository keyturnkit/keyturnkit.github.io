import { chromium } from 'playwright-core';
const b=await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
const p=await (await b.newContext({viewport:{width:760,height:520},deviceScaleFactor:2,colorScheme:'light'})).newPage();
await p.goto('http://localhost:8124/stage-options.html',{waitUntil:'networkidle'}); await p.waitForTimeout(1200);
const f=p.frameLocator('#opt');
await f.locator('input').fill('KEYTURN-DEMO-2026'); await f.getByRole('button',{name:'Activate'}).click(); await p.waitForTimeout(1500);
console.log((await f.locator('body').innerText()).replace(/\n+/g,' | '));
await p.screenshot({path:'../shots-out/chrome-5-options-pro-active.png'}); await b.close();
