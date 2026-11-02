// Browser regression coverage for contact copy and keyboard-driven production steps.
const assert = require('node:assert/strict');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const url = process.env.PORTFOLIO_URL || 'http://127.0.0.1:8016';

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  try {
    for (const scenario of ['clipboard', 'fallback', 'failure']) {
      const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
      if (scenario !== 'clipboard') {
        await context.addInitScript((shouldFail) => {
          Object.defineProperty(navigator, 'clipboard', {
            configurable: true,
            value: { writeText: async () => { throw new Error('Clipboard blocked'); } }
          });
          Object.defineProperty(document, 'execCommand', {
            configurable: true,
            value: () => !shouldFail
          });
        }, scenario === 'failure');
      }
      const page = await context.newPage();
      await page.goto(url, { waitUntil: 'domcontentloaded' });
      const button = page.locator('.copy-contact');
      const status = page.locator('#copy-status');
      assert.equal(await page.locator('.contact-address').textContent(), 'renanlima2000.aer@gmail.com');
      await button.click();
      const expected = scenario === 'failure' ? 'Não foi possível copiar' : 'E-mail copiado.';
      await page.waitForFunction((text) => document.getElementById('copy-status').textContent.includes(text), expected);
      assert((await status.textContent()).includes(expected));
      assert.equal(await button.getAttribute('data-copy-state'), scenario === 'failure' ? 'error' : 'success');
      assert.equal(await page.locator('textarea').count(), 0);
      assert.equal(await button.getAttribute('aria-busy'), null);
      console.log('PASS contact copy: ' + scenario);
      await context.close();
    }
    const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
    await page.goto(url, { waitUntil: 'domcontentloaded' });
    await page.locator('[data-backoffice-open]').click();
    const step = page.locator('[data-production-step="0"]');
    await step.focus();
    await page.keyboard.press('End');
    assert.equal(await page.locator('[data-production-step="3"]').getAttribute('aria-pressed'), 'true');
    await page.keyboard.press('Home');
    assert.equal(await step.getAttribute('aria-pressed'), 'true');
    console.log('PASS backoffice production keyboard steps');
    await page.close();
  } finally {
    await browser.close();
  }
})().catch((error) => { console.error(error); process.exitCode = 1; });
