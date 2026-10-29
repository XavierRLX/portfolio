/* Standalone Playwright QA. See docs/portfolio-backoffice-2026.md for setup. */
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const url = process.env.PORTFOLIO_URL || 'http://127.0.0.1:8016';
const output = process.env.QA_OUTPUT || '/tmp/portfolio-backoffice-qa/stacked-final';
const viewports = JSON.parse(process.env.QA_VIEWPORTS || '[[1440,900],[1280,800],[1024,768],[768,1024],[430,932],[390,844],[360,800]]');
const results = [];
let browser;

async function screenshot(page, name, fullPage = false) {
  if (fullPage) {
    await page.evaluate(() => { document.activeElement.blur(); window.scrollTo({ top: 0, behavior: 'instant' }); });
    await page.waitForTimeout(100);
  }
  await page.screenshot({ path: path.join(output, name + '.png'), fullPage });
}
async function projectView(page, group = 'products') {
  await page.evaluate((group) => {
    const anchor = document.querySelector('#projects-track-' + group).closest('[data-project-carousel]').querySelector('.projects-toolbar');
    window.scrollTo({ top: anchor.getBoundingClientRect().top + scrollY - 125, behavior: 'instant' });
  }, group);
  await page.locator('#projects-track-' + group + ' .project-card img').first().evaluate((image) => image.decode());
}
async function position(page, index, count = 1, group = 'products') {
  await page.waitForFunction(({ index, count, group }) => {
    const track = document.querySelector('#projects-track-' + group);
    const card = track.querySelectorAll('.project-card')[index];
    const expected = index + 1;
    const text = track.closest('[data-project-carousel]').querySelector('[data-carousel-position]').textContent;
    const center = getComputedStyle(track).getPropertyValue('--carousel-centered').trim() === '1';
    const error = center ? card.offsetLeft + card.offsetWidth / 2 - track.clientWidth / 2 - track.scrollLeft : card.offsetLeft - track.scrollLeft;
    return text.startsWith(String(expected).padStart(2, '0')) &&
      track.querySelectorAll('.project-card.is-current').length === count && Math.abs(error) < 2;
  }, { index, count, group });
}
async function noOverflow(page) {
  const dimensions = await page.evaluate(() => ({ width: innerWidth, scroll: document.documentElement.scrollWidth }));
  assert(dimensions.scroll <= dimensions.width, JSON.stringify(dimensions));
}
async function assertCard(page, index) {
  const card = page.locator('.project-card').nth(index);
  await card.locator('img').evaluateAll((images) => Promise.all(images.map((image) => image.decode())));
  const info = await card.evaluate((element) => {
    const image = element.querySelector('img');
    const rect = element.getBoundingClientRect();
    const nodes = element.querySelectorAll('h4, .card-copy > p, summary, .case-link, details[open] p, details[open] .card-stack');
    const clipped = Array.from(nodes).filter((node) => {
      if (!node.getClientRects().length) return false;
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
      targets: Array.from(element.querySelectorAll('summary, .case-link')).filter((node) => node.getClientRects().length).map((node) => node.getBoundingClientRect().height)
    };
  });
  assert.deepEqual(info.clipped, []);
  assert(info.decoded);
  assert.equal(info.fit, index === 5 ? 'cover' : 'contain');
  assert.equal(info.lazy, 'lazy');
  assert(info.targets.every((height) => height >= 43.5), `Small target on card ${index}: ${JSON.stringify(info.targets)}`);
  return info;
}
async function swipe(page, cdp, start, end, pause = false, group = 'products') {
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: start[0], y: start[1], id: 1 }] });
  for (let step = 1; step <= 14; step += 1) {
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{
      x: start[0] + (end[0] - start[0]) * step / 14,
      y: start[1] + (end[1] - start[1]) * step / 14, id: 1
    }] });
    await page.waitForTimeout(22);
  }
  if (pause) {
    const held = await page.locator('#projects-track-' + group).evaluate((element) => element.scrollLeft);
    await page.waitForTimeout(450);
    assert(Math.abs(await page.locator('#projects-track-' + group).evaluate((element) => element.scrollLeft) - held) < 2, 'Loop rebased while the finger was held');
  }
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
}
async function runViewport(width, height) {
  const mobile = width <= 430;
  const context = await browser.newContext({ viewport: { width, height }, hasTouch: mobile, isMobile: mobile, deviceScaleFactor: 1 });
  const page = await context.newPage();
  const errors = [], failedLocal = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });
  page.on('response', (response) => { if (response.url().startsWith(url) && response.status() >= 400) failedLocal.push(response.url()); });
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.waitForTimeout(900);
  await noOverflow(page);
  const hero = await page.evaluate(() => {
    const r = (selector) => document.querySelector(selector).getBoundingClientRect().toJSON();
    return { art: r('.hero-art'), copy: r('.hero-copy'), actions: r('.hero-actions'), height: document.querySelector('.hero').offsetHeight,
      panels: document.querySelectorAll('.tech-panel').length, stageTransform: getComputedStyle(document.querySelector('.react-stage')).transform };
  });
  assert(hero.copy.right <= hero.art.left || hero.copy.bottom <= hero.art.top);
  assert(hero.actions.bottom < height);
  assert.equal(hero.panels, 2); assert.equal(hero.stageTransform, 'none');
  await screenshot(page, `hero-${width}`);
  const integrity = await page.evaluate(() => {
    const ids = Array.from(document.querySelectorAll('[id]')).map((node) => node.id);
    return { duplicates: ids.length - new Set(ids).size,
      missingAnchors: Array.from(document.querySelectorAll('a[href^="#"]')).filter((a) => !document.getElementById(a.hash.slice(1))).length,
      unsafeLinks: Array.from(document.querySelectorAll('a[target="_blank"]')).filter((a) => !a.rel.includes('noopener') || !a.rel.includes('noreferrer')).length,
      nestedLinks: document.querySelectorAll('a a').length, cards: document.querySelectorAll('.project-card').length };
  });
  assert.deepEqual(integrity, { duplicates: 0, missingAnchors: 0, unsafeLinks: 0, nestedLinks: 0, cards: 6 });
  const count = width <= 1100 ? 1 : 3;
  const cardEvidence = [], trackHeights = [];
  for (const [group, offset] of [['products', 0], ['engineering', 3]]) {
    const root = page.locator('#projects-track-' + group).locator('..');
    const track = page.locator('#projects-track-' + group);
    const next = root.locator('[data-carousel-next]'), prev = root.locator('[data-carousel-prev]');
    const other = page.locator('#projects-track-' + (group === 'products' ? 'engineering' : 'products'));
    const otherPosition = await other.evaluate((element) => element.scrollLeft);
    await projectView(page, group); await position(page, 0, count, group);
    trackHeights.push(await track.evaluate((element) => element.offsetHeight));
    await screenshot(page, `projects-${width}-${group}`);
    if (count === 3) {
      assert(!await next.isVisible());
      for (let index = 0; index < 3; index += 1) cardEvidence.push(await assertCard(page, offset + index));
    } else {
      assert(await next.isVisible());
      const top = await page.evaluate(() => scrollY);
      for (let step = 0; step < 6; step += 1) {
        const index = step % 3;
        await position(page, index, 1, group);
        cardEvidence.push(await assertCard(page, offset + index));
        await next.click();
      }
      await position(page, 0, 1, group);
      await prev.click(); await position(page, 2, 1, group);
      assert(Math.abs(await page.evaluate(() => scrollY) - top) < 2);
      await track.focus(); await page.keyboard.press('Home'); await position(page, 0, 1, group);
      await page.keyboard.press('ArrowRight'); await position(page, 1, 1, group);
      await page.keyboard.press('End'); await position(page, 2, 1, group);
      await page.keyboard.press('Home'); await position(page, 0, 1, group);
      if (mobile) {
        const cdp = await context.newCDPSession(page);
        const bounds = await track.boundingBox();
        const y = Math.min(height - 220, bounds.y + 100);
        await swipe(page, cdp, [width * .8, y], [width * .2, y], false, group);
        await position(page, 1, 1, group);
        await track.focus(); await page.keyboard.press('End'); await position(page, 2, 1, group);
        await swipe(page, cdp, [width * .8, y], [width * .2, y], true, group); await position(page, 0, 1, group);
        await swipe(page, cdp, [width * .2, y], [width * .8, y], false, group); await position(page, 2, 1, group);
        await screenshot(page, `touch-${width}-${group}`);
        await track.focus(); await page.keyboard.press('Home'); await position(page, 0, 1, group);
        for (let index = 0; index < 5; index += 1) await next.tap();
        await position(page, 2, 1, group);
      }
    }
    assert.equal(await other.evaluate((element) => element.scrollLeft), otherPosition, 'Carousels must remain independent');
    await track.focus(); if (count === 1) { await page.keyboard.press('Home'); await position(page, 0, 1, group); }
    await page.keyboard.press('Tab'); await page.keyboard.press('Enter');
    const disclosure = page.locator('.project-card .case-details').nth(offset);
    assert(await disclosure.evaluate((element) => element.open)); await assertCard(page, offset);
    await screenshot(page, `details-${width}-${group}`); await page.keyboard.press('Enter');
    for (let index = offset; index < offset + 3; index += 1) {
      assert(await page.locator('.project-card .case-details summary').nth(index).evaluate((element) => element === document.activeElement));
      await page.keyboard.press('Tab');
      const link = page.locator('.project-card').nth(index).locator('.case-link:visible');
      assert(await link.evaluate((element) => element === document.activeElement));
      if (mobile) { const bounds = await link.boundingBox(); assert(bounds.y + bounds.height <= height - 70, 'Dock covers focused CTA'); }
      if (index < offset + 2) await page.keyboard.press('Tab');
    }
  }
  const buffers = await page.locator('.carousel-ghost').evaluateAll((nodes) => nodes.every((node) => node.inert && node.getAttribute('aria-hidden') === 'true' && !node.querySelector('[id], a, button')));
  assert(buffers);
  const rows = await page.locator('[data-project-carousel]').evaluateAll((nodes) => nodes.map((node) => node.getBoundingClientRect().toJSON()));
  assert(rows[1].top >= rows[0].bottom, 'The two carousels must be stacked');
  await testBackoffice(page, context, width, height);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  assert.equal(await page.locator('.react-mark').evaluate((element) => getComputedStyle(element).animationName), 'none');
  assert.equal(await page.evaluate(() => window.ScrollTrigger ? window.ScrollTrigger.getAll().length : 0), 0);
  await screenshot(page, `reduced-${width}`); await noOverflow(page);
  if (mobile) {
    await page.locator('.menu-toggle').click(); assert.equal(await page.locator('.menu-toggle').getAttribute('aria-expanded'), 'true');
    await page.keyboard.press('Escape'); assert.equal(await page.locator('.menu-toggle').getAttribute('aria-expanded'), 'false');
    assert(await page.locator('.menu-toggle').evaluate((element) => element === document.activeElement));
    for (const destination of ['#hSobre', '#mainContato', '#projeto', '#inicio']) {
      await page.locator(`.mobile-dock a[href="${destination}"]`).click();
      await page.waitForFunction((hash) => location.hash === hash, destination); await noOverflow(page);
    }
  }
  for (const selector of ['#hSobre', '#mainContato']) await page.locator(selector).scrollIntoViewIfNeeded();
  await page.locator('.about-portrait img').evaluate((image) => image.decode());
  await screenshot(page, `full-${width}`, true); await noOverflow(page);
  assert.deepEqual(failedLocal, []); assert.deepEqual(errors, []);
  results.push({ scenario: `${width}x${height}`, status: 'PASS', heroHeight: hero.height, trackHeights, carousels: 2, casesPerCarousel: 3, visibleCardsPerCarousel: count,
    cardHeights: cardEvidence.map((card) => Math.round(card.height)), modalTabs: 3, productionSteps: 4, touch: mobile, errors, failedLocal });
  console.log(`PASS ${width}x${height}`); await context.close();
}

async function testBackoffice(page, context, width, height) {
  const dialog = page.locator('#backoffice-dialog');
  const track = page.locator('#projects-track-engineering');
  await track.focus(); await page.keyboard.press('End');
  await position(page, width <= 1100 ? 2 : 0, width <= 1100 ? 1 : 3, 'engineering');
  const opener = page.locator('[data-backoffice-open]');
  // Record immediately before the handler, after browser click actionability
  // and native focus scrolling, rather than before Playwright scrolls the target.
  await opener.evaluate((element) => element.addEventListener('click', () => { window.qaOpenerY = scrollY; }, { capture: true, once: true }));
  await opener.click();
  const openerY = await page.evaluate(() => window.qaOpenerY);
  assert(await dialog.evaluate((element) => element.open));
  const backgroundY = await page.evaluate(() => scrollY);
  assert(await page.locator('#tab-bioplaca').evaluate((element) => element === document.activeElement));
  const geometry = async () => {
    const value = await dialog.evaluate((element) => {
      const r = element.getBoundingClientRect();
      return { left: r.left, right: r.right, top: r.top, bottom: r.bottom, width: innerWidth, height: innerHeight,
        scroll: element.scrollWidth, client: element.clientWidth };
    });
    assert(value.left >= -1 && value.right <= value.width + 1 && value.top >= -1 && value.bottom <= value.height + 1);
    assert(value.scroll <= value.client + 1, 'Dialog has horizontal overflow');
  };
  await geometry(); await screenshot(page, `modal-${width}-bioplaca`);
  for (let index = 0; index < 4; index += 1) {
    await page.locator(`[data-production-step="${index}"]`).click();
    const stage = page.locator(`[data-production-stage="${index}"]`);
    await stage.locator('img').first().evaluate((image) => image.decode());
    assert(await stage.isVisible());
    assert.equal(await page.locator(`[data-production-step="${index}"]`).getAttribute('aria-pressed'), 'true');
    assert.equal(await page.locator('[data-production-stage]:visible').count(), 1);
    await geometry();
    if ([1440, 390, 360].includes(width)) await screenshot(page, `production-${width}-${index + 1}`);
  }
  await page.locator('.editor-view summary').click();
  await page.locator('.editor-view img').evaluate((image) => image.decode());
  assert(await page.locator('.editor-view img').isVisible());
  await screenshot(page, `editor-${width}`);
  await page.locator('.editor-view summary').click();

  // Every tab and disclosure remains usable; the academic Teacher view is a real additional capture.
  for (const key of ['awx', 'pugliese']) {
    await page.locator('#tab-' + key).click();
    const panel = page.locator('#panel-' + key);
    await panel.locator('.admin-interface img').first().evaluate((image) => image.decode());
    assert.equal(await page.locator('[role="tabpanel"]:visible').count(), 1);
    assert.equal(await dialog.evaluate((element) => element.scrollTop), 0);
    await geometry(); await screenshot(page, `modal-${width}-${key}`);
    await panel.locator('.backoffice-details summary').last().click();
    assert(await panel.locator('.backoffice-details').last().evaluate((element) => element.open));
    await panel.locator('.backoffice-details summary').last().click();
  }
  await page.locator('.teacher-view summary').click();
  await page.locator('.teacher-view img').evaluate((image) => image.decode());
  assert(await page.locator('.teacher-view img').isVisible()); await screenshot(page, `teacher-${width}`);
  await page.locator('.teacher-view summary').click();
  await page.locator('#tab-pugliese').focus(); await page.keyboard.press('ArrowRight');
  assert.equal(await page.locator('#tab-bioplaca').getAttribute('aria-selected'), 'true');
  await page.keyboard.press('End'); assert.equal(await page.locator('#tab-pugliese').getAttribute('aria-selected'), 'true');
  await page.keyboard.press('Home'); assert.equal(await page.locator('#tab-bioplaca').getAttribute('aria-selected'), 'true');
  for (let index = 0; index < 20; index += 1) {
    await page.keyboard.press('Tab');
    const focus = await page.evaluate(() => {
      const active = document.activeElement;
      const dialog = document.querySelector('#backoffice-dialog');
      const navigation = dialog.querySelector('.backoffice-navigation');
      const r = active.getBoundingClientRect(), n = navigation.getBoundingClientRect(), d = dialog.getBoundingClientRect();
      return { contained: dialog.contains(active), small: r.height < 100, header: navigation.contains(active), top: r.top, bottom: r.bottom, navBottom: n.bottom, dialogBottom: d.bottom };
    });
    assert(focus.contained, 'Focus escaped modal');
    if (focus.small && !focus.header) assert(focus.top >= focus.navBottom - 2 && focus.bottom <= focus.dialogBottom - 2, 'Sticky header covers keyboard focus');
  }
  await page.locator('[data-backoffice-close]').focus();
  await page.keyboard.press('Shift+Tab');
  assert(await dialog.evaluate((element) => element.contains(document.activeElement)));
  await page.keyboard.press('Tab');
  assert(await page.locator('[data-backoffice-close]').evaluate((element) => element === document.activeElement));
  await page.locator('#tab-bioplaca').click();
  const cdp = width <= 430 ? await context.newCDPSession(page) : null;
  if (cdp) {
    await swipe(page, cdp, [width / 2, 650], [width / 2, 420]);
    assert(await dialog.evaluate((element) => element.scrollTop) > 30);
  } else {
    await page.mouse.move(width / 2, height * .75); await page.mouse.wheel(0, 300); await page.waitForTimeout(100);
  }
  assert.equal(await page.evaluate(() => scrollY), backgroundY, `Modal gesture moved background at ${width}px`);
  await page.locator('#tab-awx').click();
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.waitForFunction(() => getComputedStyle(document.querySelector('#panel-awx')).transform === 'none');
  await page.keyboard.press('Escape');
  await page.waitForFunction(() => !document.documentElement.classList.contains('has-backoffice-dialog'));
  assert(!await dialog.evaluate((element) => element.open));
  assert(await opener.evaluate((element) => element === document.activeElement));
  assert.equal(await page.evaluate(() => scrollY), openerY);
  assert(!await page.locator('html').evaluate((element) => element.classList.contains('has-backoffice-dialog')));
  await opener.click(); await page.locator('[data-backoffice-close]').click();
  assert(!await dialog.evaluate((element) => element.open));
}

async function fallbacks() {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto(url, { waitUntil: 'networkidle' });
  assert(await page.locator('.hero-actions').isVisible());
  assert.equal(await page.locator('.project-card').count(), 6);
  assert.equal(await page.locator('.backoffice-panel').count(), 3);
  assert.equal(await page.locator('[data-production-stage]').count(), 4);
  assert(await page.locator('.backoffice-fallback').isVisible());
  assert(!(await page.locator('[data-carousel-next]').first().isVisible()));
  assert(await page.locator('.mobile-dock').isVisible());
  await projectView(page);
  await page.locator('.project-card .case-details summary').first().click();
  assert(await page.locator('.project-card .case-details').first().evaluate((element) => element.open));
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
  await blocked.locator('[data-carousel-next]').first().click(); await position(blocked, 1);
  await blocked.locator('#projects-track-engineering').focus(); await blocked.keyboard.press('End'); await position(blocked, 2, 1, 'engineering');
  await blocked.locator('[data-backoffice-open]').click(); await blocked.locator('#tab-pugliese').click();
  assert(await blocked.locator('#panel-pugliese').isVisible()); await blocked.keyboard.press('Escape');
  await screenshot(blocked, 'no-gsap'); await noOverflow(blocked); assert.deepEqual(errors, []);
  await blocked.close(); results.push({ scenario: 'GSAP CDN blocked', status: 'PASS' });
  console.log('PASS GSAP CDN blocked');

  const reduced = await browser.newPage({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
  await reduced.goto(url, { waitUntil: 'networkidle' });
  assert.equal(await reduced.locator('.react-mark').evaluate((element) => getComputedStyle(element).animationName), 'none');
  await projectView(reduced); await reduced.locator('[data-carousel-next]').first().click(); await position(reduced, 1);
  // Resize across actual composition breakpoints, preserving a reachable selected project.
  for (const width of [430, 360, 700, 701, 1100, 1101, 1280, 390]) {
    await reduced.setViewportSize({ width, height: 900 });
    await reduced.waitForTimeout(350);
    await position(reduced, width <= 1100 ? 1 : 0, width <= 1100 ? 1 : 3); await noOverflow(reduced);
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
