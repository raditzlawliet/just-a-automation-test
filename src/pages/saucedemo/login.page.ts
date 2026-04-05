import { expect, type Locator, type Page } from '@playwright/test';

import { env } from '../../config/env';

export class SauceDemoLoginPage {
  readonly page: Page;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorBanner: Locator;

  constructor(page: Page) {
    this.page = page;
    this.usernameInput = page.getByTestId('username');
    this.passwordInput = page.getByTestId('password');
    this.loginButton = page.getByTestId('login-button');
    this.errorBanner = page.getByTestId('error');
  }

  async goto() {
    await this.page.goto(env.urls.sauceDemo);
  }

  async login(username: string, password: string) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async assertError(message: RegExp | string) {
    await expect(this.errorBanner).toContainText(message);
  }

  async assertReady() {
    await expect(this.loginButton).toBeVisible();
  }
}