import { env } from '../../../src/config/env';
import { test, expect } from '../../fixtures/test-fixtures';

test.describe('Sauce Demo auth', () => {
  test('Login with valid credentials @smoke @regression', async ({
    sauceLoginPage,
    sauceInventoryPage,
  }) => {
    await sauceLoginPage.goto();
    await sauceLoginPage.login(env.sauceDemo.standardUser.username, env.sauceDemo.standardUser.password);

    await sauceInventoryPage.assertLoaded();
  });

  test('Login with wrong password shows an error @regression', async ({ sauceLoginPage }) => {
    await sauceLoginPage.goto();
    await sauceLoginPage.login(env.sauceDemo.standardUser.username, 'wrong_password');

    await sauceLoginPage.assertError(/username and password do not match/i);
  });

  test('Login with empty fields shows validation @regression', async ({ sauceLoginPage }) => {
    await sauceLoginPage.goto();
    await sauceLoginPage.login('', '');

    await sauceLoginPage.assertError(/username is required/i);
  });

  test('Locked-out user gets clear feedback @regression', async ({ sauceLoginPage }) => {
    await sauceLoginPage.goto();
    await sauceLoginPage.login(env.sauceDemo.lockedOutUser.username, env.sauceDemo.lockedOutUser.password);

    await sauceLoginPage.assertError(/sorry, this user has been locked out/i);
  });

  test('Session persists after a page refresh @regression', async ({
    page,
    sauceLoginPage,
    sauceInventoryPage,
  }) => {
    await sauceLoginPage.goto();
    await sauceLoginPage.login(env.sauceDemo.standardUser.username, env.sauceDemo.standardUser.password);
    await sauceInventoryPage.assertLoaded();

    await page.reload();

    await sauceInventoryPage.assertLoaded();
  });

  test('Logout clears session and redirects to login @smoke @regression', async ({
    sauceLoginPage,
    sauceInventoryPage,
  }) => {
    await sauceLoginPage.goto();
    await sauceLoginPage.login(env.sauceDemo.standardUser.username, env.sauceDemo.standardUser.password);
    await sauceInventoryPage.assertLoaded();

    await sauceInventoryPage.logout();

    await sauceLoginPage.assertReady();
    await expect(sauceInventoryPage.page).toHaveURL(/saucedemo\.com\/?$/);
  });
});