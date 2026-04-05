import { expect, type Page } from '@playwright/test';

export class SauceDemoCartPage {
  constructor(private readonly page: Page) {}

  async assertLoaded() {
    await expect(this.page).toHaveURL(/cart/);
    await expect(this.page.getByTestId('title')).toHaveText('Your Cart');
  }

  async expectItemVisible(productName: string) {
    await expect(this.cartItem(productName)).toBeVisible();
  }

  async removeItem(productName: string) {
    await this.cartItem(productName).getByRole('button', { name: /remove/i }).click();
  }

  async continueShopping() {
    await this.page.getByTestId('continue-shopping').click();
  }

  async startCheckout() {
    await this.page.getByTestId('checkout').click();
  }

  private cartItem(productName: string) {
    return this.page.locator('.cart_item').filter({
      has: this.page.locator('.inventory_item_name', { hasText: productName }),
    });
  }
}