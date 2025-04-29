// Import Playwright test functions and HomePage class
import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';

// ============================================
// Test Case: Lead Capture Form Validation
// ============================================
test('Lead Capture Form Validation', async ({ page }) => {
  // Initialize the HomePage object with Playwright's page instance
  const home = new HomePage(page);

  try {
    // STEP 1: Navigate to Netlify homepage and ensure page is loaded
    await home.navigate(); // Waits for the input field to ensure DOM is ready

    // Verify the page title contains "Netlify" as an additional check
    await expect(page).toHaveTitle(/Netlify/);

    // Additionally verify HTTP response status is 200
    const response = await page.goto('https://www.netlify.com/');
    expect(response?.status()).toBe(200); // Page should respond OK

    // Submit form with an invalid email address
    await home.subscribeWithEmail('marin.ra.yahoo.com');

    // Wait for error message that indicates invalid input
    await expect(page).not.toHaveURL(/.*thanks-for-signing-up/);
    
    //Submit form with a valid email
    await home.subscribeWithEmail('m_aranitasi@yahoo.com');

    // Wait for the success message that indicates valid input
    await expect(page).toHaveURL(/.*thanks-for-signing-up/);

  } catch (error) {
  
    
    throw error; // Rethrow to ensure Playwright marks it as a failure
  }
});