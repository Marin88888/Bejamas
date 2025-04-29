import { Page, Locator } from '@playwright/test';

export class HomePage {
  readonly page: Page;
  readonly newsLetterInput: Locator;
  readonly newsLetterButton: Locator;

  constructor(page: Page) {
    this.page = page;
    //locator of the email field
    this.newsLetterInput = page.locator('input[name="email"]');
    //locator of the submit button
    this.newsLetterButton = this.page.locator('input[type="submit"][value="Subscribe"]');

  }
    //go to the page (wait until the page is loaded)
    async navigate() {
      await this.page.goto('https://www.netlify.com/', { waitUntil: 'domcontentloaded' });
      await this.page.waitForSelector('input[name="email"]', { timeout: 5000 });
    }
    

  async subscribeWithEmail(email: string) {
    await this.newsLetterInput.fill(email);
    await this.newsLetterButton.waitFor({ state: 'visible' }); // wait to ensure it's rendered
    await this.newsLetterButton.click();

  }
}
