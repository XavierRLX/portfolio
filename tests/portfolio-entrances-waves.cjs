/* Browser QA: restored intro, live wave boundaries and animated carousel content. */
const assert = require('node:assert/strict');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const url = process.env.PORTFOLIO_URL || 'http://127.0.0.1:8016';

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  try {
    for (const width of [390, 1440]) {
      const page = await browser.newPage({ viewport: { width, height: width === 390 ? 844 : 900 }, reducedMotion: 'no-preference' });
      const errors = [];
      page.on('pageerror', (err) => errors.push(err.message));
      await page.goto(url, { waitUntil: 'domcontentloaded' });
      assert.equal(await page.locator('html').getAttribute('data-intro'), 'playing');
      assert.equal(await page.locator('.hero-description.is-typing').count(), 1);
      await page.waitForTimeout(1100);
      const textLength = await page.locator('.typewriter-render').evaluate((node) => node.textContent.length);
      assert(textLength > 5 && textLength < 58, 'Typing must be visibly progressive');
      await page.waitForFunction(() => document.documentElement.dataset.intro === 'complete', null, { timeout: 5000 });
      const boundaries = await page.locator('.section-wave').evaluateAll((nodes) => nodes.map((node) => ({
        parent: node.parentElement.className, width: node.getBoundingClientRect().width,
        svgAnimation: getComputedStyle(node.querySelector('.wave-current')).animationName
      })));
      assert.deepEqual(boundaries.map((w) => w.parent), ['hero', 'projects-section', 'approach-section', 'profile-section']);
      assert(boundaries.every((w) => w.width === width && w.svgAnimation === 'wave-drift'));
      const wave = page.locator('.section-wave--projects .wave-current');
      const first = await wave.evaluate((node) => getComputedStyle(node).transform);
      await page.waitForTimeout(330);
      const second = await wave.evaluate((node) => getComputedStyle(node).transform);
      assert.notEqual(first, second, 'Water edge should drift over time');

      const products = page.locator('#projects-track-products');
      await products.scrollIntoViewIfNeeded();
      await page.waitForFunction((isMobile) => {
        const cards = [...document.querySelectorAll('#projects-track-products .project-card')];
        return isMobile ? cards[0].dataset.motionCount === '1' :
          cards.every((card) => card.dataset.motionCount === '1');
      }, width === 390, { timeout: 5000 });
      if (width === 390) {
        await page.locator('[aria-label="Próximo projeto em Produtos"]').click();
        await page.waitForFunction(() => document.querySelectorAll('#projects-track-products .project-card')[1].dataset.motionCount === '1', null, { timeout: 5000 });
        const ghostCount = await page.locator('.carousel-ghost[data-motion-count]').count();
        assert.equal(ghostCount, 0, 'Cloned visual buffers must never be animated');
      }
      await page.waitForTimeout(900);
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
      assert.deepEqual(errors, []);
      console.log('PASS entrance + typing + four animated edges + carousel transitions:', width);
      await page.close();
    }

    const reduced = await browser.newPage({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
    await reduced.goto(url, { waitUntil: 'domcontentloaded' });
    assert.equal(await reduced.locator('.hero-description.is-typing').count(), 0);
    assert.equal(await reduced.locator('.section-wave').count(), 4);
    const css = await reduced.locator('.wave-current').first().evaluate((element) => getComputedStyle(element).animationName);
    assert.equal(css, 'none');
    await reduced.locator('#projects-track-products').scrollIntoViewIfNeeded();
    await reduced.waitForTimeout(350);
    assert.equal(await reduced.locator('.project-card[data-motion-count]').count(), 0);
    console.log('PASS accessible reduced motion (static text, wave and projects)');
    await reduced.close();

    const blocked = await browser.newPage({ viewport: { width: 390, height: 844 } });
    await blocked.route('**/gsap@**', (route) => route.abort());
    await blocked.goto(url, { waitUntil: 'domcontentloaded' });
    assert.equal(await blocked.locator('html').getAttribute('data-intro'), 'playing');
    await blocked.waitForTimeout(1250);
    assert((await blocked.locator('.typewriter-render').textContent()).length > 0);
    await blocked.waitForFunction(() => document.documentElement.dataset.intro === 'complete');
    await blocked.locator('#projects-track-products').scrollIntoViewIfNeeded();
    assert.equal(await blocked.locator('.project-card[data-motion-count]').count(), 0);
    console.log('PASS intro and text independent of GSAP CDN');
    await blocked.close();
  } finally {
    await browser.close();
  }
})().catch((error) => { console.error(error); process.exitCode = 1; });
