import type { Browser, Page } from 'puppeteer';
import puppeteer from 'puppeteer';
// FIXME once https://github.com/facebook/jest/issues/9771
import { startApp, App } from '@reworkjs/core/lib/internals/cli/node-interface';

let browser: Browser;
let app: App;
beforeAll(async () => {
  app = await startApp({ env: 'test' });
  browser = await puppeteer.launch();
});

let page: Page;
beforeEach(async () => {
  page = await browser.newPage();
});

describe('@reworkjs/core/i18n', () => {
  it('exposes data', async () => {
    await page.goto(`http://localhost:${app.getPort()}`);
  });
});

afterAll(async () => {
  await Promise.all([
    app.close(),
    browser.close(),
  ]);
})
