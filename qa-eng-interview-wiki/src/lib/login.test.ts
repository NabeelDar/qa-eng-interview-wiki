import { test, expect } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config();

const wikipediaUsername = process.env.WIKIPEDIA_USERNAME;
const wikipediaPassword = process.env.WIKIPEDIA_PASSWORD;
const authFile = 'src/auth/login.json';

/**
 * Manually create a Wikipedia account and then finish this test
 * so that it signs into Wikipedia and captures the logged-in
 * session to src/auth/login.json, so that the tests in all.test.ts
 * run as a signed in user.
 */
test('Sign in to Wikipedia', async ({ page }) => {
    if (!wikipediaUsername || !wikipediaPassword) {
        throw new Error('Need a username and password to sign in! Username or password not set in .env file.');
    }

    await page.goto('https://en.wikipedia.org/w/index.php?title=Special:UserLogin&returnto=Main_Page');

    // Fill in the username
    await page.locator('#wpName1').fill(wikipediaUsername);

    // Fill in the password
    await page.locator('#wpPassword1').fill(wikipediaPassword);

    // Click the login button
    await page.locator('#wpLoginAttempt').click();

    // Check if the logout button exists once logged in
    const loggedInIndicator = page.locator('#pt-logout a');
    await expect(loggedInIndicator).not.toHaveCount(0, { timeout: 5000 });

    // Save storage state to a file.
    await page.context().storageState({ path: authFile });
    console.log(`Storage state saved to ${authFile}`);
});

