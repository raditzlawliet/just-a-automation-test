import { env } from '../../../src/config/env';
import { test } from '../../fixtures/test-fixtures';

async function loginToOpenMrs(loginPage: { goto: () => Promise<void>; login: (username: string, password: string) => Promise<void> }, homePage: { assertLoaded: () => Promise<void> }) {
  await loginPage.goto();
  await loginPage.login(env.openMrs.username, env.openMrs.password);
  await homePage.assertLoaded();
}

test.describe('OpenMRS healthcare workflows', () => {
  test('Navigate to Find Patient Record and open a chart @healthcare @regression', async ({
    openMrsLoginPage,
    openMrsHomePage,
    openMrsFindPatientPage,
  }) => {
    await loginToOpenMrs(openMrsLoginPage, openMrsHomePage);
    await openMrsHomePage.openModule('Find Patient Record');
    await openMrsFindPatientPage.assertLoaded(/Find Patient Record/i);

    await openMrsFindPatientPage.search(env.openMrs.patientSearchTerm);
    await openMrsFindPatientPage.expectResults();
    await openMrsFindPatientPage.openFirstResult();
    await openMrsFindPatientPage.expectPatientChartOpened();
  });

  test('Navigate to Capture Vitals search screen @healthcare @regression', async ({
    openMrsLoginPage,
    openMrsHomePage,
    openMrsFindPatientPage,
  }) => {
    await loginToOpenMrs(openMrsLoginPage, openMrsHomePage);
    await openMrsHomePage.openModule('Capture Vitals');

    await openMrsFindPatientPage.assertLoaded(/Capture Vitals/i);
  });
});