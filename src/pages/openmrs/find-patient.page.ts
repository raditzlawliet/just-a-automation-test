import { expect, type Locator, type Page } from '@playwright/test';

export class OpenMrsFindPatientPage {
  readonly page: Page;
  readonly searchInput: Locator;
  readonly resultsTable: Locator;

  constructor(page: Page) {
    this.page = page;
    this.searchInput = page.locator('#patient-search');
    this.resultsTable = page.locator('#patient-search-results');
  }

  async assertLoaded(expectedHeading: RegExp | string = /Find Patient Record/i) {
    await expect(this.page.getByRole('heading', { name: expectedHeading })).toBeVisible();
    await expect(this.searchInput).toBeVisible();
  }

  async search(term: string) {
    await this.searchInput.fill(term);
  }

  async expectResults() {
    await expect(this.resultsTable.locator('tbody tr').first()).toBeVisible();
  }

  async openFirstResult() {
    await this.resultsTable.locator('tbody tr').first().click();
  }

  async expectPatientChartOpened() {
    await expect(this.page).toHaveURL(/patient.*page/);
  }
}