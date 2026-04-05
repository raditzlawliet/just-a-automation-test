import { env } from '../../../src/config/env';
import { test } from '../../fixtures/test-fixtures';

const backpack = 'Sauce Labs Backpack';
const bikeLight = 'Sauce Labs Bike Light';

async function loginAsStandardUser(loginPage: { goto: () => Promise<void>; login: (username: string, password: string) => Promise<void> }, inventoryPage: { assertLoaded: () => Promise<void> }) {
  await loginPage.goto();
  await loginPage.login(env.sauceDemo.standardUser.username, env.sauceDemo.standardUser.password);
  await inventoryPage.assertLoaded();
}

test.describe('Sauce Demo cart and checkout', () => {
  test('Add a single item to the cart @smoke @regression', async ({
    sauceLoginPage,
    sauceInventoryPage,
    sauceCartPage,
  }) => {
    await loginAsStandardUser(sauceLoginPage, sauceInventoryPage);
    await sauceInventoryPage.addItemToCart(backpack);
    await sauceInventoryPage.expectCartCount(1);
    await sauceInventoryPage.openCart();

    await sauceCartPage.assertLoaded();
    await sauceCartPage.expectItemVisible(backpack);
  });

  test('Add multiple items updates the cart badge @regression', async ({
    sauceLoginPage,
    sauceInventoryPage,
  }) => {
    await loginAsStandardUser(sauceLoginPage, sauceInventoryPage);
    await sauceInventoryPage.addItemToCart(backpack);
    await sauceInventoryPage.addItemToCart(bikeLight);

    await sauceInventoryPage.expectCartCount(2);
  });

  test('Remove an item from the cart page @regression', async ({
    sauceLoginPage,
    sauceInventoryPage,
    sauceCartPage,
  }) => {
    await loginAsStandardUser(sauceLoginPage, sauceInventoryPage);
    await sauceInventoryPage.addItemToCart(backpack);
    await sauceInventoryPage.openCart();
    await sauceCartPage.assertLoaded();

    await sauceCartPage.removeItem(backpack);

    await sauceInventoryPage.expectCartEmpty();
  });

  test('Cart persists across navigation @regression', async ({
    sauceLoginPage,
    sauceInventoryPage,
    sauceCartPage,
  }) => {
    await loginAsStandardUser(sauceLoginPage, sauceInventoryPage);
    await sauceInventoryPage.addItemToCart(backpack);
    await sauceInventoryPage.openCart();
    await sauceCartPage.assertLoaded();

    await sauceCartPage.continueShopping();
    await sauceInventoryPage.assertLoaded();
    await sauceInventoryPage.expectCartCount(1);
  });

  test('Complete the full checkout flow @smoke @regression', async ({
    sauceLoginPage,
    sauceInventoryPage,
    sauceCartPage,
    sauceCheckoutPage,
  }) => {
    await loginAsStandardUser(sauceLoginPage, sauceInventoryPage);
    await sauceInventoryPage.addItemToCart(backpack);
    await sauceInventoryPage.openCart();
    await sauceCartPage.startCheckout();
    await sauceCheckoutPage.assertInformationStepLoaded();

    await sauceCheckoutPage.fillInformation('QA', 'Engineer', '10001');
    await sauceCheckoutPage.continue();
    await sauceCheckoutPage.assertOverviewStepLoaded();

    await sauceCheckoutPage.finish();
    await sauceCheckoutPage.assertCompleted();
  });

  test('Checkout with missing info shows an error @regression', async ({
    sauceLoginPage,
    sauceInventoryPage,
    sauceCartPage,
    sauceCheckoutPage,
  }) => {
    await loginAsStandardUser(sauceLoginPage, sauceInventoryPage);
    await sauceInventoryPage.addItemToCart(backpack);
    await sauceInventoryPage.openCart();
    await sauceCartPage.startCheckout();
    await sauceCheckoutPage.assertInformationStepLoaded();

    await sauceCheckoutPage.fillInformation('', 'Engineer', '10001');
    await sauceCheckoutPage.continue();

    await sauceCheckoutPage.assertError(/first name is required/i);
  });

  test('Cart is empty after a successful order when a new session starts @regression', async ({
    page,
    sauceLoginPage,
    sauceInventoryPage,
    sauceCartPage,
    sauceCheckoutPage,
  }) => {
    await loginAsStandardUser(sauceLoginPage, sauceInventoryPage);
    await sauceInventoryPage.addItemToCart(backpack);
    await sauceInventoryPage.openCart();
    await sauceCartPage.startCheckout();
    await sauceCheckoutPage.fillInformation('QA', 'Engineer', '10001');
    await sauceCheckoutPage.continue();
    await sauceCheckoutPage.finish();
    await sauceCheckoutPage.assertCompleted();

    await page.context().clearCookies();
    await sauceLoginPage.goto();
    await sauceLoginPage.login(env.sauceDemo.standardUser.username, env.sauceDemo.standardUser.password);
    await sauceInventoryPage.assertLoaded();

    await sauceInventoryPage.expectCartEmpty();
  });
});