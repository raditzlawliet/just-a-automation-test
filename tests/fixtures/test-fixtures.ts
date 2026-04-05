import { test as base, expect } from '@playwright/test';

import { OpenMrsFindPatientPage } from '../../src/pages/openmrs/find-patient.page';
import { OpenMrsHomePage } from '../../src/pages/openmrs/home.page';
import { OpenMrsLoginPage } from '../../src/pages/openmrs/login.page';
import { SauceDemoCartPage } from '../../src/pages/saucedemo/cart.page';
import { SauceDemoCheckoutPage } from '../../src/pages/saucedemo/checkout.page';
import { SauceDemoInventoryPage } from '../../src/pages/saucedemo/inventory.page';
import { SauceDemoLoginPage } from '../../src/pages/saucedemo/login.page';

type AppFixtures = {
  sauceLoginPage: SauceDemoLoginPage;
  sauceInventoryPage: SauceDemoInventoryPage;
  sauceCartPage: SauceDemoCartPage;
  sauceCheckoutPage: SauceDemoCheckoutPage;
  openMrsLoginPage: OpenMrsLoginPage;
  openMrsHomePage: OpenMrsHomePage;
  openMrsFindPatientPage: OpenMrsFindPatientPage;
};

export const test = base.extend<AppFixtures>({
  sauceLoginPage: async ({ page }, use) => {
    await use(new SauceDemoLoginPage(page));
  },
  sauceInventoryPage: async ({ page }, use) => {
    await use(new SauceDemoInventoryPage(page));
  },
  sauceCartPage: async ({ page }, use) => {
    await use(new SauceDemoCartPage(page));
  },
  sauceCheckoutPage: async ({ page }, use) => {
    await use(new SauceDemoCheckoutPage(page));
  },
  openMrsLoginPage: async ({ page }, use) => {
    await use(new OpenMrsLoginPage(page));
  },
  openMrsHomePage: async ({ page }, use) => {
    await use(new OpenMrsHomePage(page));
  },
  openMrsFindPatientPage: async ({ page }, use) => {
    await use(new OpenMrsFindPatientPage(page));
  },
});

export { expect };