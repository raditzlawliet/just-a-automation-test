import { expect, type Page } from '@playwright/test';

export class OpenMrsHomePage {
  constructor(private readonly page: Page) {}

  async assertLoaded() {
    await expect(this.page.locator('#referenceapplication-homepage')).toBeVisible();
  }

  async openModule(moduleName: string) {
    await this.page.getByRole('link', { name: moduleName }).click();
  }

  async expectWidgetVisible(widgetText: string) {
    await expect(this.page.getByText(widgetText, { exact: false })).toBeVisible();
  }

  async logout() {
    await this.page.getByRole('link', { name: /logout/i }).click();
  }
}