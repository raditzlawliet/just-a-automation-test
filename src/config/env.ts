import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  CI: z.string().optional(),
  SAUCE_DEMO_URL: z.string().url().default('https://www.saucedemo.com'),
  SAUCE_STANDARD_USER: z.string().default('standard_user'),
  SAUCE_STANDARD_PASSWORD: z.string().default('secret_sauce'),
  SAUCE_LOCKED_OUT_USER: z.string().default('locked_out_user'),
  SAUCE_LOCKED_OUT_PASSWORD: z.string().default('secret_sauce'),
  OPENMRS_URL: z.string().url().default('https://demo.openmrs.org/openmrs/login.htm'),
  OPENMRS_USERNAME: z.string().default('admin'),
  OPENMRS_PASSWORD: z.string().default('Admin123'),
  OPENMRS_LOCATION: z.string().default('Inpatient Ward'),
  OPENMRS_PATIENT_SEARCH_TERM: z.string().default('John'),
  REQRES_API_URL: z.string().url().default('https://reqres.in/api'),
  REQRES_API_KEY: z.string().optional(),
  TESTRAIL_ENABLED: z.enum(['true', 'false']).default('false'),
  TESTRAIL_HOST: z.string().url().optional(),
  TESTRAIL_USERNAME: z.string().optional(),
  TESTRAIL_API_KEY: z.string().optional(),
  TESTRAIL_PROJECT_ID: z.string().optional(),
  TESTRAIL_SUITE_ID: z.string().optional(),
  TESTRAIL_RUN_NAME: z.string().default('QA Automation Learning'),
  TESTRAIL_RUN_ID: z.string().optional(),
  TESTRAIL_STATUS_SKIPPED: z.string().optional(),
});

const parsed = envSchema.parse(process.env);

export const env = {
  isCi: Boolean(parsed.CI),
  urls: {
    sauceDemo: parsed.SAUCE_DEMO_URL,
    openMrs: parsed.OPENMRS_URL,
    reqresApi: parsed.REQRES_API_URL,
  },
  sauceDemo: {
    standardUser: {
      username: parsed.SAUCE_STANDARD_USER,
      password: parsed.SAUCE_STANDARD_PASSWORD,
    },
    lockedOutUser: {
      username: parsed.SAUCE_LOCKED_OUT_USER,
      password: parsed.SAUCE_LOCKED_OUT_PASSWORD,
    },
  },
  openMrs: {
    username: parsed.OPENMRS_USERNAME,
    password: parsed.OPENMRS_PASSWORD,
    location: parsed.OPENMRS_LOCATION,
    patientSearchTerm: parsed.OPENMRS_PATIENT_SEARCH_TERM,
  },
  reqres: {
    apiKey: parsed.REQRES_API_KEY,
  },
  testRail: {
    enabled: parsed.TESTRAIL_ENABLED === 'true',
    host: parsed.TESTRAIL_HOST,
    username: parsed.TESTRAIL_USERNAME,
    apiKey: parsed.TESTRAIL_API_KEY,
    projectId: parsed.TESTRAIL_PROJECT_ID,
    suiteId: parsed.TESTRAIL_SUITE_ID,
    runName: parsed.TESTRAIL_RUN_NAME,
    runId: parsed.TESTRAIL_RUN_ID,
    skippedStatusId: parsed.TESTRAIL_STATUS_SKIPPED,
  },
} as const;