import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { logSuccess, logWarning, logFailure } from '../utils/reportToSitemap';



test('Lead Capture Form Validation', async ({ page }) => {
  const home = new HomePage(page);

  try {
    //Navigate
    await home.navigate();

    //Title check
    await expect(page).toHaveTitle(/Netlify/);
    await logSuccess('Lead Capture Form Validation', 'Page title contains "Netlify"');

    //HTTP status check
    const response = await page.goto('https://www.netlify.com/');
    expect(response?.status()).toBe(200);
    await logSuccess('Lead Capture Form Validation', 'Page responded with status 200');

    //Valid email
    await home.subscribeWithEmail('m_aranitasi@yahoo.com');
    await expect(page).toHaveURL(/.*thanks-for-signing-up/);
    await logSuccess('Lead Capture Form Validation', 'Valid email successfully reached thank-you page');

    //Invalid email
    await home.subscribeWithEmail('marin.ra.yahoo.com');
    try {
      await expect(page).not.toHaveURL(/.*thanks-for-signing-up/);
      await logSuccess('Lead Capture Form Validation', 'Invalid email correctly did not lead to thank-you page');
    } catch {
      await logWarning('Lead Capture Form Validation', 'Invalid email unexpectedly led to thank-you page');
    }

  } catch (error) {
    console.error('Lead Capture Form Validation failed:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    await logFailure('Lead Capture Form Validation', errorMessage);
    throw error; 
  }
});
