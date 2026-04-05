import { expect, type Locator, type Page } from '@playwright/test';

export class SauceDemoCheckoutPage {
  readonly page: Page;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly postalCodeInput: Locator;
  readonly continueButton: Locator;
  readonly finishButton: Locator;
  readonly errorBanner: Locator;

  constructor(page: Page) {
    this.page = page;
    this.firstNameInput = page.getByTestId('firstName');
    this.lastNameInput = page.getByTestId('lastName');
    this.postalCodeInput = page.getByTestId('postalCode');
    this.continueButton = page.getByTestId('continue');
    this.finishButton = page.getByTestId('finish');
    this.errorBanner = page.getByTestId('error');
  }

  async assertInformationStepLoaded() {
    await expect(this.page).toHaveURL(/checkout-step-one/);
    await expect(this.page.getByTestId('title')).toHaveText('Checkout: Your Information');
  }

  async fillInformation(firstName: string, lastName: string, postalCode: string) {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.postalCodeInput.fill(postalCode);
  }

  async continue() {
    await this.continueButton.click();
  }

  async assertOverviewStepLoaded() {
    await expect(this.page).toHaveURL(/checkout-step-two/);
    await expect(this.page.getByTestId('title')).toHaveText('Checkout: Overview');
  }

  async finish() {
    await this.finishButton.click();
  }

  async assertCompleted() {
    await expect(this.page).toHaveURL(/checkout-complete/);
    await expect(this.page.getByTestId('complete-header')).toHaveText('Thank you for your order!');
  }

  async assertError(message: RegExp | string) {
    await expect(this.errorBanner).toContainText(message);
  }

  async getItemTotal() {
    const text = await this.page.getByTestId('subtotal-label').textContent();
    return Number(text?.replace('Item total: $', ''));
  }
}