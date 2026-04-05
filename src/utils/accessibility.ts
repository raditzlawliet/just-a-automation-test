import AxeBuilder from '@axe-core/playwright';
import { expect, type Page } from '@playwright/test';

export async function expectNoA11yViolations(page: Page) {
  const results = await new AxeBuilder({ page }).analyze();
  const violationSummary = results.violations
    .map((violation) => `${violation.id}: ${violation.nodes.length} node(s)`)
    .join('\n');

  expect(results.violations, violationSummary || 'No accessibility violations found.').toEqual([]);
}