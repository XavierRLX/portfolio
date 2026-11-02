/* React hero kinetic interaction: behavior, a11y and performance regression. */
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const url = process.env.PORTFOLIO_URL || 'http://127.0.0.1:8016';
const output = process.env.QA_OUTPUT || '/tmp/portfolio-react-interaction-20261102';

(async () => {
  await fs.mkdir(output, { recursive: true });
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  try {
    for (const width of [1440, 390, 360]) {
      const page = await browser.newPage({ viewport: { width, height: width === 1440 ? 900 : 844 } });
      const errors = [];
      page.on('pageerror', (error) => errors.push(error.message));
      await page.goto(url, { waitUntil: 'networkidle' });
      const button = page.locator('.react-control');
      const art = page.locator('.hero-art');
      const status = page.locator('[data-react-status]');
      assert(await button.isEnabled());
      assert.equal(await art.getAttribute('aria-hidden'), null);
      assert.equal(await button.getAttribute('aria-describedby'), 'react-interaction-help');
      assert(await page.locator('#react-interaction-help').count());
      assert(await button.getAttribute('aria-label'));
      await button.focus();
      await page.keyboard.press('Enter');
      assert.equal(await art.getAttribute('data-react-level'), '1', 'Enter should activate React boost');
      await button.click();
      assert.equal(await art.getAttribute('data-react-level'), '2');
      await button.click();
      await button.click();
      assert.equal(await art.getAttribute('data-react-level'), '3', 'Maximum 3 stages');
      await page.waitForTimeout(600);
      const active = await page.evaluate(() => {
        const mark = document.querySelector('.react-mark');
        const tween = gsap.getTweensOf(mark)[0];
        return {
          stageScale: gsap.getProperty('.react-control', 'scale'),
          panelScale: gsap.getProperty('.tech-panel--interface', 'scale'),
          spinRate: tween?.timeScale(),
          overflow: document.documentElement.scrollWidth > innerWidth
        };
      });
      assert(active.stageScale > 1.2 && active.stageScale < 1.31, JSON.stringify(active));
      assert(active.panelScale < 1, JSON.stringify(active));
      assert(active.spinRate >= 15.4 && active.spinRate <= 16.1, JSON.stringify(active));
      assert(!active.overflow, JSON.stringify(active));
      assert((await status.textContent()).includes('turbo 3'));
      await page.screenshot({ path: `${output}/turbo-${width}.png` });
      await page.waitForTimeout(4900);
      assert.equal(await art.getAttribute('data-react-level'), '0');
      const idle = await page.evaluate(() => ({
        scale: gsap.getProperty('.react-control', 'scale'),
        rate: gsap.getTweensOf('.react-mark')[0]?.timeScale(),
        overflow: document.documentElement.scrollWidth > innerWidth
      }));
      assert(Math.abs(idle.scale - 1) < 0.02 && Math.abs(idle.rate - 1) < 0.05 && !idle.overflow, JSON.stringify(idle));
      assert.deepEqual(errors, []);
      console.log('PASS react interaction, boost, cap and decay: ' + width);
      await page.close();
    }

    const reduced = await browser.newPage({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
    await reduced.goto(url, { waitUntil: 'networkidle' });
    const button = reduced.locator('.react-control');
    assert(await button.isEnabled());
    await button.click();
    assert.equal(await reduced.locator('.hero-art').getAttribute('data-react-level'), '1');
    assert.equal(await reduced.locator('.react-mark').evaluate((e) => getComputedStyle(e).animationName), 'none');
    assert((await reduced.locator('[data-react-status]').textContent()).includes('Movimento desativado'));
    await reduced.emulateMedia({ reducedMotion: 'no-preference' });
    assert(await button.isEnabled());
    await button.click();
    assert.equal(await reduced.locator('.hero-art').getAttribute('data-react-level'), '1');
    await reduced.emulateMedia({ reducedMotion: 'reduce' });
    assert(await button.isEnabled());
    assert.equal(await reduced.locator('.react-mark').evaluate((e) => getComputedStyle(e).animationName), 'none');
    await reduced.close();
    console.log('PASS reduced motion and live media preference switching');

    const blocked = await browser.newPage({ viewport: { width: 390, height: 844 } });
    await blocked.route('**/gsap@**', (route) => route.abort());
    await blocked.goto(url, { waitUntil: 'networkidle' });
    assert(await blocked.locator('.react-control').isDisabled());
    assert(!(await blocked.locator('.react-hint').isVisible()));
    assert(await blocked.locator('.react-mark').isVisible());
    await blocked.close();
    console.log('PASS graceful no-GSAP fallback');

    const noJs = await browser.newPage({ viewport: { width: 390, height: 844 }, javaScriptEnabled: false });
    await noJs.goto(url, { waitUntil: 'networkidle' });
    assert(await noJs.locator('.react-control').isDisabled());
    assert(!(await noJs.locator('.react-hint').isVisible()));
    await noJs.close();
    console.log('PASS graceful no-JavaScript fallback');
  } finally {
    await browser.close();
  }
})().catch((e) => { console.error(e); process.exitCode = 1; });
