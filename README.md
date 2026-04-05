# Just a Automation Test

![CI](https://github.com/raditzlawliet/just-a-automation-test/actions/workflows/ci.yml/badge.svg)

A automation framework built with **Playwright + TypeScript**, covering E2E, API, and accessibility testing with full CI/CD integration.

## What This Covers

- **E2E Web Tests** — Auth, cart, and full checkout flow (Sauce Demo)
- **API Contract Tests** — CRUD, auth, schema validation (ReqRes API)
- **Accessibility** — WCAG 2.1 AA via axe-playwright
- **CI/CD** — GitHub Actions with artifact reporting on every push
- **Multi-browser** — Chromium, Firefox, mobile viewport

## Stack

| Tool           | Purpose              |
| -------------- | -------------------- |
| Playwright     | E2E + API testing    |
| TypeScript     | Type-safe test code  |
| axe-playwright | Accessibility checks |
| Allure         | Test reporting       |
| GitHub Actions | CI/CD pipeline       |

## Applications Under Test

- Sauce Demo: <https://www.saucedemo.com>
- OpenMRS Demo: <https://demo.openmrs.org>
- ReqRes API: <https://reqres.in>

## Quick Start

```bash
npm install
npx playwright install
npx playwright test              # all tests
npx playwright test tests/api/   # API only
npx playwright show-report       # open HTML report

pip install trcli # for TestRail CLI upload manually

copy .env.example .env # set any overrides, especially REQRES_API_KEY for API tests
```

## Test Strategy

Tests are organized by risk priority:

1. **Smoke** — auth + core flow (runs on every PR)
2. **Regression** — full suite (runs nightly)
3. **API contracts** — schema + status validation
4. **Accessibility** — WCAG 2.1 AA on critical pages

## Project Structure

```text
.
├── .github/workflows/
├── src/
│   ├── config/
│   ├── pages/
│   │   ├── openmrs/
│   │   └── saucedemo/
│   ├── schemas/
│   └── utils/
├── tests/
│   ├── api/
│   ├── e2e/
│   │   ├── accessibility/
│   │   ├── auth/
│   │   ├── cart/
│   │   └── healthcare/
│   └── fixtures/
├── playwright.config.ts
└── README.md
```

## Full Test List

### Auth Tests (`tests/e2e/auth/`)

| Test Case                           | Type       | Why It Matters           |
| ----------------------------------- | ---------- | ------------------------ |
| Login with valid credentials        | Happy path | Core smoke test          |
| Login with wrong password           | Negative   | Error message validation |
| Login with empty fields             | Boundary   | Form validation          |
| Locked-out user gets clear error    | Edge case  | UX and error handling    |
| Session persists after page refresh | State      | Auth token behavior      |
| Logout clears session and redirects | Happy path | Security hygiene         |

### Cart and Checkout Tests (`tests/e2e/cart/`)

| Test Case                              | Type           | Why It Matters               |
| -------------------------------------- | -------------- | ---------------------------- |
| Add single item to cart                | Happy path     | Core user flow               |
| Add multiple items and verify count    | State          | UI state management          |
| Remove item from cart                  | Happy path     | Cart CRUD                    |
| Cart persists across navigation        | State          | Session and storage behavior |
| Complete full checkout flow            | E2E            | Critical path                |
| Checkout with missing info shows error | Negative       | Form validation              |
| Cart is empty after successful order   | Post-condition | Data integrity               |

### Accessibility Tests (`tests/e2e/accessibility/`)

| Test Case                           | Type         | Why It Matters         |
| ----------------------------------- | ------------ | ---------------------- |
| Login page passes axe scan          | WCAG 2.1 AA  | Accessibility baseline |
| Inventory page passes axe scan      | WCAG 2.1 AA  | Accessibility baseline |
| Checkout form is keyboard navigable | Keyboard nav | Form usability         |

### Healthcare-Flavored OpenMRS Tests (`tests/e2e/healthcare/`)

| Test Case                                        | Type            | Why It Matters                        |
| ------------------------------------------------ | --------------- | ------------------------------------- |
| Login with valid credentials                     | Smoke           | Confirms healthcare app access        |
| Invalid login shows clear error                  | Negative        | Auth UX validation                    |
| Logout returns to login page                     | Happy path      | Session termination                   |
| Home page widgets render after login             | Smoke           | Dashboard readiness                   |
| Navigate to Find Patient Record and open a chart | Domain workflow | Demonstrates EHR navigation awareness |
| Navigate to Capture Vitals search screen         | Domain workflow | Shows healthcare workflow familiarity |

### API Tests (`tests/api/`)

Use ReqRes (`https://reqres.in`) for real REST API auth, users, and CRUD flows.

| Test Case                                               | Type       | Why It Matters     |
| ------------------------------------------------------- | ---------- | ------------------ |
| `POST /login` returns token for valid user              | Happy path | Auth contract      |
| `POST /login` returns 400 for missing password          | Negative   | Error contract     |
| `GET /users` returns paginated list with correct schema | Schema     | Contract testing   |
| `GET /users/2` returns correct user schema              | Schema     | Resource contract  |
| `POST /users` creates user and returns 201              | Happy path | CRUD               |
| `PUT /users/:id` updates and returns updated fields     | Happy path | CRUD               |
| `DELETE /users/:id` returns 204                         | Happy path | CRUD               |
| `GET /users/999` returns 404                            | Negative   | Not found handling |

## TestRail Integration

Supports two TestRail paths.

### 1. JUnit + TestRail CLI

This is the default CI-friendly path. Playwright emits `test-results/junit/results.xml`, and GitHub Actions can upload it to TestRail with the documented CLI command flow.

Required secrets:

- `TESTRAIL_HOST`
- `TESTRAIL_PROJECT_NAME`
- `TESTRAIL_USERNAME`
- `TESTRAIL_API_KEY`

### 2. Direct Playwright Reporter

The repo also includes `playwright-testrail-reporter`. To enable it, set `TESTRAIL_ENABLED=true` and provide the required `TESTRAIL_*` variables in `.env` or CI secrets.

## Notes

- Sauce Demo credentials default to `standard_user / secret_sauce` and `locked_out_user / secret_sauce`.
- OpenMRS defaults to `admin / Admin123` at `Inpatient Ward`.
- ReqRes API tests require `REQRES_API_KEY` because anonymous calls now return `401`.
- OpenMRS is a shared demo environment, so the suite avoids destructive patient updates.
