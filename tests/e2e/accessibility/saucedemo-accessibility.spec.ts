import { env } from '../../../src/config/env';
import { expectNoA11yViolations } from '../../../src/utils/accessibility';
import { test, expect } from '../../fixtures/test-fixtures';

test.describe('Sauce Demo accessibility', () => {
  test('Login page passes an axe scan @a11y @smoke', async ({ sauceLoginPage }) => {
    await sauceLoginPage.goto();
    await expectNoA11yViolations(sauceLoginPage.page);
  });

  test('Inventory page passes an axe scan @a11y @regression', async ({
    sauceLoginPage,
    sauceInventoryPage,
  }) => {
    await sauceLoginPage.goto();
    await sauceLoginPage.login(env.sauceDemo.standardUser.username, env.sauceDemo.standardUser.password);
    await sauceInventoryPage.assertLoaded();

    await expectNoA11yViolations(sauceInventoryPage.page);
  });

  test('Checkout form supports keyboard navigation @a11y @regression', async ({
    page,
    sauceLoginPage,
    sauceInventoryPage,
    sauceCartPage,
    sauceCheckoutPage,
  }) => {
    await sauceLoginPage.goto();
    await sauceLoginPage.login(env.sauceDemo.standardUser.username, env.sauceDemo.standardUser.password);
    await sauceInventoryPage.addItemToCart('Sauce Labs Backpack');
    await sauceInventoryPage.openCart();
    await sauceCartPage.startCheckout();
    await sauceCheckoutPage.assertInformationStepLoaded();

    await sauceCheckoutPage.firstNameInput.focus();
    await expect(sauceCheckoutPage.firstNameInput).toBeFocused();
    await page.keyboard.press('Tab');
    await expect(sauceCheckoutPage.lastNameInput).toBeFocused();
    await page.keyboard.press('Tab');
    await expect(sauceCheckoutPage.postalCodeInput).toBeFocused();
    await page.keyboard.press('Tab');
    await expect(sauceCheckoutPage.continueButton).toBeFocused();
  });
});