import { expect, type Locator, type Page } from '@playwright/test';

export class SauceDemoInventoryPage {
  readonly page: Page;
  readonly title: Locator;
  readonly cartLink: Locator;
  readonly cartBadge: Locator;
  readonly sortDropdown: Locator;
  readonly menuButton: Locator;
  readonly logoutLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.title = page.getByTestId('title');
    this.cartLink = page.getByTestId('shopping-cart-link');
    this.cartBadge = page.getByTestId('shopping-cart-badge');
    this.sortDropdown = page.getByTestId('product-sort-container');
    this.menuButton = page.locator('#react-burger-menu-btn');
    this.logoutLink = page.locator('#logout_sidebar_link');
  }

  async assertLoaded() {
    await expect(this.page).toHaveURL(/inventory/);
    await expect(this.title).toHaveText('Products');
  }

  async sort(optionValue: 'az' | 'za' | 'lohi' | 'hilo') {
    await this.sortDropdown.selectOption(optionValue);
  }

  async addItemToCart(productName: string) {
    await this.productCard(productName).getByRole('button', { name: /add to cart/i }).click();
  }

  async removeItem(productName: string) {
    await this.productCard(productName).getByRole('button', { name: /remove/i }).click();
  }

  async openCart() {
    await this.cartLink.click();
  }

  async expectCartCount(count: number) {
    await expect(this.cartBadge).toHaveText(String(count));
  }

  async expectCartEmpty() {
    await expect(this.cartBadge).toHaveCount(0);
  }

  async openMenu() {
    await this.menuButton.click();
    await expect(this.logoutLink).toBeVisible();
  }

  async logout() {
    await this.openMenu();
    await this.logoutLink.click();
  }

  private productCard(productName: string) {
    return this.page.locator('.inventory_item').filter({
      has: this.page.locator('.inventory_item_name', { hasText: productName }),
    });
  }
}