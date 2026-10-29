/* Optional audit dependency, kept out of the static site's production runtime. */
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const AxeBuilder = require(process.env.AXE_MODULE || '@axe-core/playwright').default;
const output = process.env.QA_OUTPUT || '/tmp/portfolio-backoffice-qa/stacked-final';
(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const results = [];
  try {
    for (const width of [1440, 390]) {
      const context = await browser.newContext({ viewport: { width, height: 900 }, reducedMotion: 'reduce' });
      const page = await context.newPage();
      await page.goto(process.env.PORTFOLIO_URL || 'http://127.0.0.1:8016', { waitUntil: 'networkidle' });
      const audit = async (region, scenario) => {
        const result = await new AxeBuilder({ page }).include(region)
          .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze();
        results.push({ width, scenario, violations: result.violations.map(({ id, impact, nodes }) => ({ id, impact, targets: nodes.map((node) => node.target) })) });
      };
      await page.locator('#projects-track-engineering').focus();
      await audit('main', 'main');
      await page.keyboard.press('End');
      await page.locator('[data-backoffice-open]').click();
      for (const key of ['bioplaca', 'awx', 'pugliese']) {
        await page.locator('#tab-' + key).click();
        await audit('#backoffice-dialog', key);
      }
      await context.close();
    }
    await fs.mkdir(output, { recursive: true });
    await fs.writeFile(path.join(output, 'accessibility.json'), JSON.stringify(results, null, 2));
    assert(results.every((result) => !result.violations.length), JSON.stringify(results.filter((result) => result.violations.length), null, 2));
    console.log('PASS 8 axe audits (main + three dialog tabs, desktop/mobile).');
  } finally { await browser.close(); }
})().catch((error) => { console.error(error); process.exitCode = 1; });
