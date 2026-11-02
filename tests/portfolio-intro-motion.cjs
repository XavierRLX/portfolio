const { chromium }=require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs/promises');
const url=process.env.PORTFOLIO_URL || 'http://127.0.0.1:8016';
const out=process.env.QA_OUTPUT || '/tmp/portfolio-intro-20261102/motion';
(async () => {
 await fs.mkdir(out,{recursive:true});
 const browser=await chromium.launch({channel:'chrome',headless:true});
 try {
  for(const width of [1440,390,360]) {
   const height=width===1440?900:844;
   const page=await browser.newPage({viewport:{width,height},reducedMotion:'no-preference'});
   const errors=[];
   page.on('pageerror',error=>errors.push(error.message));
   await page.goto(url,{waitUntil:'networkidle'});
   // Exercise entry within the first two seconds after application scripts run.
   const state=await page.evaluate(()=>({present:!!document.querySelector('.hero-boot'),gsap:!!window.gsap,description:document.querySelector('.hero-description').textContent,css3d:getComputedStyle(document.querySelector('.boot-cube')).transform,bootAnimation:getComputedStyle(document.querySelector('.boot-cube')).animationName}));
   assert(state.present && state.gsap && state.bootAnimation.includes('boot-assemble'));
   await page.screenshot({path:`${out}/entry-${width}.png`});
   await page.waitForTimeout(2300);
   const end=await page.evaluate(()=>({source:getComputedStyle(document.querySelector('.typewriter-reserve')).color,render:document.querySelector('.typewriter-render').textContent,typing:document.querySelector('.hero-description').classList.contains('is-typing'),bootOpacity:getComputedStyle(document.querySelector('.hero-boot')).opacity,overflow:document.documentElement.scrollWidth>innerWidth}));
   assert(!end.typing && !end.render && !end.overflow && end.bootOpacity==='0', JSON.stringify(end));
   await page.screenshot({path:`${out}/settled-${width}.png`});
   await page.emulateMedia({reducedMotion:'reduce'});
   const reduced=await page.evaluate(()=>({boot:getComputedStyle(document.querySelector('.hero-boot')).display,rotate:getComputedStyle(document.querySelector('.react-mark')).animationName,typing:document.querySelector('.hero-description').classList.contains('is-typing')}));
   assert.equal(reduced.boot,'none');
   assert.equal(reduced.rotate,'none');
   assert(!reduced.typing);
   assert.deepEqual(errors,[]);
   console.log('PASS intro/typing/3D/reduced '+width);
   await page.close();
  }
  const page=await browser.newPage({viewport:{width:390,height:844},reducedMotion:'no-preference'});
  await page.goto(url,{waitUntil:'networkidle'});
  await page.reload({waitUntil:'domcontentloaded'});
  await page.waitForTimeout(80);
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.waitForTimeout(100);
  assert(await page.locator('.hero-description.is-typing').count()===0);
  assert(await page.locator('.typewriter-reserve').isVisible());
  console.log('PASS reduced motion change during intro');
  await page.close();
 } finally {await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1});
