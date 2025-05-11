import { Page, expect } from "@playwright/test";

/**
 * This test was generated using Ranger"s test recording tool. The test is supposed to:
 * 1. Navigate to Wikipedia
 * 2. Go to the "Artificial intelligence" page
 * 3. Click "View history"
 * 4. Assert that the latest edit was made by the user "Worstbull"
 *
 * Instructions:
 * - Run the test and ensure it performs all steps described above
 * - Add assertions to the test to ensure it validates the expected
 *   behavior:
 *   - If the latest edit was not made by "Worstbull" update the steps above accordingly
 *   - Write your assertion to provide clear diagnostic feedback if it fails
 *
 * Good luck!
 */ 

export async function run(page: Page, params: {}) {
  /** STEP 1: Navigate */
  await page.goto('https://www.wikipedia.org/');

  // STEP 2: search ai and hit enter
  const searchInput = page.getByRole('searchbox', { name: 'Search Wikipedia' });
  await searchInput.fill('artificial intelligence');
  await searchInput.press('Enter');
  await page.waitForLoadState('networkidle');


  // STEP 3: click on view history tab
  const viewHistory = page.locator('#ca-history').getByRole('link', { name: 'View history' });
  await viewHistory.waitFor({ state: 'visible', timeout: 15000 });
  await viewHistory.click();

  //STEP 4: Assert that the latest edit was made by "Worstbull" else fail
  const expectedUser = 'Worstbull';
  const editorLocator = page.locator('#pagehistory li .history-user a bdi')
    .first();

  // Finally assert the username
  await expect(
    editorLocator,
    `Expected the latest revision to be by "${expectedUser}", but found "${await editorLocator.textContent()}".`
  ).toHaveText(expectedUser, { timeout: 5000 });

}
