import { env } from '../../../src/config/env';
import { test, expect } from '../../fixtures/test-fixtures';

test.describe('OpenMRS auth and dashboard', () => {
  test('Login with valid credentials @healthcare @smoke', async ({
    openMrsLoginPage,
    openMrsHomePage,
  }) => {
    await openMrsLoginPage.goto();
    await openMrsLoginPage.login(env.openMrs.username, env.openMrs.password);

    await openMrsHomePage.assertLoaded();
  });

  test('Invalid login shows an authentication error @healthcare @regression', async ({ openMrsLoginPage }) => {
    await openMrsLoginPage.goto();
    await openMrsLoginPage.login(env.openMrs.username, 'wrong-password');

    await openMrsLoginPage.assertError(/invalid username\/password/i);
  });

  test('Logout returns the user to the login page @healthcare @regression', async ({
    openMrsLoginPage,
    openMrsHomePage,
  }) => {
    await openMrsLoginPage.goto();
    await openMrsLoginPage.login(env.openMrs.username, env.openMrs.password);
    await openMrsHomePage.assertLoaded();

    await openMrsHomePage.logout();

    await openMrsLoginPage.assertReady();
    await expect(openMrsLoginPage.page).toHaveURL(/login\.htm/);
  });

  test('Home page widgets render after login @healthcare @regression', async ({
    openMrsLoginPage,
    openMrsHomePage,
  }) => {
    await openMrsLoginPage.goto();
    await openMrsLoginPage.login(env.openMrs.username, env.openMrs.password);

    await openMrsHomePage.expectWidgetVisible('Find Patient Record');
    await openMrsHomePage.expectWidgetVisible('Capture Vitals');
  });
});