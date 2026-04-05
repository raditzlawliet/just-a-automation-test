import { expect, type Locator, type Page } from '@playwright/test';

import { env } from '../../config/env';

export class OpenMrsLoginPage {
  readonly page: Page;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly errorBanner: Locator;

  constructor(page: Page) {
    this.page = page;
    this.usernameInput = page.locator('#username');
    this.passwordInput = page.locator('#password');
    this.errorBanner = page.locator('#error-message');
  }

  async goto() {
    await this.page.goto(env.urls.openMrs);
  }

  async login(username: string, password: string, location = env.openMrs.location) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.page.getByText(location, { exact: true }).click();
    await this.page.getByRole('button', { name: /log in/i }).click();
  }

  async assertReady() {
    await expect(this.usernameInput).toBeVisible();
    await expect(this.page.getByText(env.openMrs.location, { exact: true })).toBeVisible();
  }

  async assertError(message: RegExp | string) {
    await expect(this.errorBanner).toContainText(message);
  }
}