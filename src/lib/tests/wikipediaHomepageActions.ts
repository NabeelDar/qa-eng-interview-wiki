import { Locator, Page, expect } from '@playwright/test';

/**
 * This test was generated using Ranger's test recording tool. The test is supposed to:
 * 1. Navigate to Wikipedia's homepage
 * 2. Assert there are less than 7,000,000 articles in English
 * 3. Assert the page's text gets smaller when the 'Small' text size option is selected
 * 4. Assert the page's text gets larger when the 'Large' text size option is selected
 * 5. Assert the page's text goes back to the default size when the 'Standard' text size option is selected
 *
 * Instructions: Run the test and ensure it performs all steps described above
 *
 * Good luck!
 */


export async function run(page: Page, params: {}) {
  /** STEP 1: Navigate */
  await page.goto('https://en.wikipedia.org/wiki/Main_Page');

  /** STEP 2: Article count */
  const englishCountLink = page
    .locator('#articlecount ul li')
    .nth(1)
    .locator('a')
    .first();
  await expect(englishCountLink).toBeVisible({ timeout: 10_000 });
  const rawCountText = (await englishCountLink.textContent())!.trim();
  const articlesNum = parseInt(rawCountText.replace(/,/g, ''), 10);
  expect(
    articlesNum,
    `Expected fewer than 7,000,000 English articles, but found ${articlesNum}`
  ).toBeLessThan(7_000_000);
  console.log(`✔️ English articles: ${articlesNum}`);

  /** STEPS 3–5: Font‐size toggles */

  // pick the heading
  const target = page.locator('#Welcome_to_Wikipedia');

  // helper to read computed font-size
  const getFontSize = async () =>
    parseFloat(await target.evaluate(el => getComputedStyle(el).fontSize));

  const initialSize = await getFontSize();
  console.log(`Initial heading font-size: ${initialSize}px`);

  // *** RE-INTRODUCED FONT SIZE MENU LOCATOR ***
  const fontSizeMenu = page.locator(
    '#skin-client-prefs-vector-feature-custom-font-size'
  );
  await expect(fontSizeMenu, 'Font‐size menu must be present').toBeVisible();

  // click a radio, wait, then assert relative to initialSize
  async function checkSize(
    value: '0' | '1' | '2',
    label: 'Small' | 'Standard' | 'Large',
    comparator: 'lt' | 'gt' | 'eq'
  ) {
    const radio = fontSizeMenu.locator(`input[value="${value}"]`);
    await expect(radio, `Radio for "${label}" should exist`).toHaveCount(1);
    await radio.click();
    await page.waitForTimeout(500);

    const newSize = await getFontSize();
    console.log(`${label} heading font-size: ${newSize}px`);

    if (comparator === 'lt') {
      expect(newSize, `${label} should be smaller`).toBeLessThan(initialSize);
    } else if (comparator === 'gt') {
      expect(newSize, `${label} should be larger`).toBeGreaterThan(initialSize);
    } else {
      expect(newSize, `${label} should return to initial`).toBeCloseTo(initialSize, 0.1);
    }
  }

  // now run the three checks
  await checkSize('0', 'Small', 'lt');
  await checkSize('2', 'Large', 'gt');
  await checkSize('1', 'Standard', 'eq');
}