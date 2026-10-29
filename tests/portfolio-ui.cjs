/* Standalone Playwright QA. See docs/portfolio-premium-refinement-2026.md for setup. */
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const url = process.env.PORTFOLIO_URL || 'http://127.0.0.1:8016';
const output = process.env.QA_OUTPUT || '/tmp/portfolio-refinement-qa/final';
const viewports = [[1440, 900], [1280, 800], [1024, 768], [768, 1024], [430, 932], [390, 844], [360, 800]];
const results = [];
let browser;

async function screenshot(page, name, fullPage = false) {
  if (fullPage) {
    await page.evaluate(() => { document.activeElement.blur(); window.scrollTo({ top: 0, behavior: 'instant' }); });
    await page.waitForTimeout(100);
  }
  await page.screenshot({ path: path.join(output, name + '.png'), fullPage });
}
async function projectView(page) {
  await page.locator('.projects-toolbar').evaluate((element) => {
    window.scrollTo({ top: element.getBoundingClientRect().top + scrollY - 125, behavior: 'instant' });
  });
  await page.locator('.project-card img').first().evaluate((image) => image.decode());
}
async function position(page, index, count = 1) {
  await page.waitForFunction(({ index, count }) => {
    const track = document.querySelector('#projects-track');
    const card = track.children[index];
    const expected = index + 1;
    const text = document.querySelector('#projects-position').textContent;
    const center = getComputedStyle(track).getPropertyValue('--carousel-centered').trim() === '1';
    const error = center ? card.offsetLeft + card.offsetWidth / 2 - track.clientWidth / 2 - track.scrollLeft : card.offsetLeft - track.scrollLeft;
    return text.startsWith(String(expected).padStart(2, '0')) &&
      track.querySelectorAll('.is-current').length === count && Math.abs(error) < 2;
  }, { index, count });
}
async function noOverflow(page) {
  const dimensions = await page.evaluate(() => ({ width: innerWidth, scroll: document.documentElement.scrollWidth }));
  assert(dimensions.scroll <= dimensions.width, JSON.stringify(dimensions));
}
async function assertCard(page, index) {
  const card = page.locator('.project-card').nth(index);
  await card.locator('img').evaluate((image) => image.decode());
  const info = await card.evaluate((element) => {
    const image = element.querySelector('img');
    const rect = element.getBoundingClientRect();
    const nodes = element.querySelectorAll('h3, .card-copy > p, summary, .case-link, details[open] p, details[open] .card-stack');
    const clipped = Array.from(nodes).filter((node) => {
      const range = document.createRange();
      range.selectNodeContents(node);
      const r = range.getBoundingClientRect();
      // A rotated disclosure icon may overflow its summary while remaining inside the card.
      return r.left < rect.left - 1 || r.right > rect.right + 1 || r.bottom > rect.bottom + 1;
    }).map((node) => node.textContent);
    return {
      clipped, decoded: image.complete && image.naturalWidth > 0,
      fit: getComputedStyle(image).objectFit,
      lazy: image.loading, height: rect.height,
      targets: Array.from(element.querySelectorAll('summary, .case-link')).map((node) => node.getBoundingClientRect().height)
    };
  });
  assert.deepEqual(info.clipped, []);
  assert(info.decoded);
  assert.equal(info.fit, 'contain');
  assert.equal(info.lazy, 'lazy');
  assert(info.targets.every((height) => height >= 43.5));
  return info;
}
async function swipe(page, cdp, start, end) {
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: start[0], y: start[1], id: 1 }] });
  for (let step = 1; step <= 14; step += 1) {
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{
      x: start[0] + (end[0] - start[0]) * step / 14,
      y: start[1] + (end[1] - start[1]) * step / 14, id: 1
    }] });
    await page.waitForTimeout(22);
  }
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
}
async function runViewport(width, height) {
  const mobile = width <= 430;
  const context = await browser.newContext({ viewport: { width, height }, hasTouch: mobile, isMobile: mobile, deviceScaleFactor: 1 });
  const page = await context.newPage();
  const errors = [];
  const failedLocal = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });
  page.on('response', (response) => { if (response.url().startsWith(url) && response.status() >= 400) failedLocal.push(response.url()); });
  await page.addInitScript(() => {
    window.qaLayoutShifts = [];
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) if (!entry.hadRecentInput) window.qaLayoutShifts.push(entry.value);
    }).observe({ type: 'layout-shift', buffered: true });
  });
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000); // Let the progressive entrance finish before visual QA.
  await noOverflow(page);
  const hero = await page.evaluate(() => {
    const rect = (selector) => document.querySelector(selector).getBoundingClientRect().toJSON();
    return { art: rect('.hero-art'), copy: rect('.hero-copy'), actions: rect('.hero-actions'),
      height: document.querySelector('.hero').offsetHeight, panels: document.querySelectorAll('.tech-panel').length,
      stageTransform: getComputedStyle(document.querySelector('.react-stage')).transform,
      cls: window.qaLayoutShifts.reduce((sum, value) => sum + value, 0) };
  });
  assert(hero.copy.right <= hero.art.left || hero.copy.bottom <= hero.art.top);
  assert(hero.actions.bottom < height);
  assert.equal(hero.panels, 2);
  assert.equal(hero.stageTransform, 'none');
  await screenshot(page, `hero-${width}`);

  // Document integrity and native links remain independent of enhancement.
  const integrity = await page.evaluate(() => {
    const ids = Array.from(document.querySelectorAll('[id]')).map((node) => node.id);
    return { duplicates: ids.length - new Set(ids).size,
      missingAnchors: Array.from(document.querySelectorAll('a[href^="#"]')).filter((a) => !document.getElementById(a.hash.slice(1))).length,
      unsafeLinks: Array.from(document.querySelectorAll('a[target="_blank"]')).filter((a) => !a.rel.includes('noopener') || !a.rel.includes('noreferrer')).length,
      nestedLinks: document.querySelectorAll('a a').length, cards: document.querySelectorAll('.project-card').length };
  });
  assert.deepEqual(integrity, { duplicates: 0, missingAnchors: 0, unsafeLinks: 0, nestedLinks: 0, cards: 5 });
  await projectView(page);
  const count = width <= 850 ? 1 : 2;
  await position(page, 0, count);
  assert(await page.locator('#projects-prev').isDisabled());
  const trackHeight = await page.locator('#projects-track').evaluate((element) => element.offsetHeight);
  await screenshot(page, `projects-${width}-first`);
  const scrollY = await page.evaluate(() => window.scrollY);
  const cardEvidence = [];
  const steps = 5 - count;
  for (let index = 0; index <= steps; index += 1) {
    if (index) { await page.locator('#projects-next').click(); await position(page, index, count); }
    assert(Math.abs(await page.evaluate(() => window.scrollY) - scrollY) < 2, 'Horizontal controls moved the page vertically');
    cardEvidence.push(await assertCard(page, index));
  }
  if (count === 2) cardEvidence.push(await assertCard(page, 4));
  assert(await page.locator('#projects-next').isDisabled());
  await screenshot(page, `projects-${width}-last`);
  for (let index = steps - 1; index >= 0; index -= 1) {
    await page.locator('#projects-prev').click(); await position(page, index, count);
  }

  const track = page.locator('#projects-track');
  await track.focus(); await page.keyboard.press('ArrowRight'); await position(page, 1, count);
  await page.keyboard.press('End'); await position(page, steps, count);
  await page.keyboard.press('Home'); await position(page, 0, count);
  await page.keyboard.press('Tab'); await page.keyboard.press('Enter');
  assert(await page.locator('.case-details').first().evaluate((element) => element.open));
  await assertCard(page, 0);
  await screenshot(page, `details-${width}`);
  await page.keyboard.press('Enter');
  for (let index = 0; index < 5; index += 1) {
    assert(await page.locator('.case-details summary').nth(index).evaluate((element) => element === document.activeElement));
    await page.keyboard.press('Tab');
    assert(await page.locator('.case-link').nth(index).evaluate((element) => element === document.activeElement));
    if (index < 4) await page.keyboard.press('Tab');
  }
  await track.focus(); await page.keyboard.press('Home'); await position(page, 0, count);

  if (mobile) {
    // Trusted touch gestures exercise the browser's native scrolling, not synthetic DOM events.
    await projectView(page);
    const cdp = await context.newCDPSession(page);
    const before = await page.evaluate(() => window.scrollY);
    await swipe(page, cdp, [width * 0.8, 280], [width * 0.2, 280]);
    await position(page, 1);
    assert(Math.abs(await page.evaluate(() => window.scrollY) - before) < 2);
    await screenshot(page, `touch-${width}`);
    await swipe(page, cdp, [width / 2, 450], [width / 2, 280]);
    await page.waitForFunction((previous) => scrollY > previous + 60, before);
    await projectView(page);
    await track.focus(); await page.keyboard.press('Home'); await position(page, 0);
    for (let index = 0; index < 4; index += 1) await page.locator('#projects-next').tap();
    await position(page, 4);
    await track.focus(); await page.keyboard.press('Home'); await position(page, 0);
  }

  // Toggle reduced motion during the session, then confirm navigation still works instantly.
  await page.emulateMedia({ reducedMotion: 'reduce' });
  assert.equal(await page.locator('.react-mark').evaluate((element) => getComputedStyle(element).animationName), 'none');
  assert.equal(await page.evaluate(() => window.ScrollTrigger ? window.ScrollTrigger.getAll().length : 0), 0);
  await page.locator('#projects-next').click(); await position(page, 1, count);
  await screenshot(page, `reduced-${width}`);
  await noOverflow(page);

  if (mobile) {
    await page.locator('.menu-toggle').click();
    assert.equal(await page.locator('.menu-toggle').getAttribute('aria-expanded'), 'true');
    await page.keyboard.press('Escape');
    assert.equal(await page.locator('.menu-toggle').getAttribute('aria-expanded'), 'false');
    assert(await page.locator('.menu-toggle').evaluate((element) => element === document.activeElement));
    for (const destination of ['#hSobre', '#mainContato', '#projeto', '#inicio']) {
      await page.locator(`.mobile-dock a[href="${destination}"]`).click();
      await page.waitForFunction((hash) => location.hash === hash, destination);
      await noOverflow(page);
    }
  }
  // Walk all sections before a complete page screenshot and decode every lazy image.
  for (const selector of ['#hSobre', '#mainContato']) {
    await page.locator(selector).scrollIntoViewIfNeeded();
    await page.waitForTimeout(100);
  }
  await page.locator('.about-portrait img').evaluate((image) => image.decode());
  await screenshot(page, `full-${width}`, true);
  await noOverflow(page);
  assert.deepEqual(failedLocal, []);
  assert.deepEqual(errors, []);
  results.push({ scenario: `${width}x${height}`, status: 'PASS', heroHeight: hero.height, trackHeight,
    initialCLS: hero.cls, cardHeights: cardEvidence.map((card) => Math.round(card.height)), errors, failedLocal });
  console.log(`PASS ${width}x${height}`);
  await context.close();
}

async function fallbacks() {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto(url, { waitUntil: 'networkidle' });
  assert(await page.locator('.hero-actions').isVisible());
  assert.equal(await page.locator('.project-card').count(), 5);
  assert(!(await page.locator('#projects-next').isVisible()));
  assert(await page.locator('.mobile-dock').isVisible());
  await projectView(page);
  await page.locator('.case-details summary').first().click();
  assert(await page.locator('.case-details').first().evaluate((element) => element.open));
  await screenshot(page, 'no-js'); await noOverflow(page);
  await context.close(); results.push({ scenario: 'JavaScript disabled', status: 'PASS' });
  console.log('PASS JavaScript disabled');

  const blocked = await browser.newPage({ viewport: { width: 390, height: 844 } });
  const errors = [];
  blocked.on('pageerror', (error) => errors.push(error.message));
  await blocked.route('**/npm/gsap@**', (route) => route.abort());
  await blocked.goto(url, { waitUntil: 'networkidle' });
  assert.equal(await blocked.evaluate(() => typeof window.gsap), 'undefined');
  await projectView(blocked);
  await blocked.locator('#projects-next').click(); await position(blocked, 1);
  await screenshot(blocked, 'no-gsap'); await noOverflow(blocked); assert.deepEqual(errors, []);
  await blocked.close(); results.push({ scenario: 'GSAP CDN blocked', status: 'PASS' });
  console.log('PASS GSAP CDN blocked');

  const reduced = await browser.newPage({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
  await reduced.goto(url, { waitUntil: 'networkidle' });
  assert.equal(await reduced.locator('.react-mark').evaluate((element) => getComputedStyle(element).animationName), 'none');
  await projectView(reduced); await reduced.locator('#projects-next').click(); await position(reduced, 1);
  // Resize across actual composition breakpoints, preserving a reachable selected project.
  for (const width of [430, 360, 700, 701, 850, 851, 1280, 390]) {
    await reduced.setViewportSize({ width, height: 900 });
    await reduced.waitForTimeout(350);
    await position(reduced, 1, width <= 850 ? 1 : 2); await noOverflow(reduced);
  }
  await screenshot(reduced, 'resize-and-reduced');
  await reduced.close(); results.push({ scenario: 'Reduced motion at load + breakpoint resize', status: 'PASS' });
  console.log('PASS Reduced motion at load + breakpoint resize');
}

(async () => {
  await fs.mkdir(output, { recursive: true });
  browser = await chromium.launch({ channel: process.env.QA_BROWSER_CHANNEL || 'chrome', headless: true });
  try {
    // Bounded parallelism keeps local CPU/memory usage moderate.
    for (let index = 0; index < viewports.length; index += 2) {
      await Promise.all(viewports.slice(index, index + 2).map(([width, height]) => runViewport(width, height)));
    }
    await fallbacks();
    await fs.writeFile(path.join(output, 'results.json'), JSON.stringify(results, null, 2));
    console.log(`PASS ${results.length} scenarios. Evidence: ${output}`);
  } finally { await browser.close(); }
})().catch((error) => { console.error(error); process.exitCode = 1; });
