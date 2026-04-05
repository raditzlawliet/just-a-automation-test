import { expect, test } from '@playwright/test';

import {
  reqresLoginSchema,
  reqresUserListSchema,
  reqresUserMutationSchema,
  reqresUserSchema,
} from '../../src/schemas/reqres.schemas';
import { env } from '../../src/config/env';

test.describe('ReqRes API', () => {
  test.skip(!env.reqres.apiKey, 'ReqRes now requires an API key in REQRES_API_KEY.');

  const headers = env.reqres.apiKey
    ? {
        'x-api-key': env.reqres.apiKey,
      }
    : undefined;

  test('POST /login returns a token for valid credentials @api @smoke', async ({ request }) => {
    const response = await request.post(`${env.urls.reqresApi}/login`, {
      headers,
      data: {
        email: 'eve.holt@reqres.in',
        password: 'cityslicka',
      },
    });

    expect(response.status()).toBe(200);
    expect(reqresLoginSchema.safeParse(await response.json()).success).toBe(true);
  });

  test('POST /login returns 400 when the password is missing @api @regression', async ({ request }) => {
    const response = await request.post(`${env.urls.reqresApi}/login`, {
      headers,
      data: {
        email: 'peter@klaven',
      },
    });

    expect(response.status()).toBe(400);
    await expect(response.json()).resolves.toMatchObject({ error: 'Missing password' });
  });

  test('GET /users returns a paginated list with the expected schema @api @regression', async ({ request }) => {
    const response = await request.get(`${env.urls.reqresApi}/users?page=2`, { headers });
    const body = await response.json();

    expect(response.status()).toBe(200);
    expect(reqresUserListSchema.safeParse(body).success).toBe(true);
  });

  test('GET /users/2 returns a user payload with the expected shape @api @regression', async ({ request }) => {
    const response = await request.get(`${env.urls.reqresApi}/users/2`, { headers });
    const body = await response.json();

    expect(response.status()).toBe(200);
    expect(reqresUserSchema.safeParse(body.data).success).toBe(true);
  });

  test('POST /users creates a user and returns 201 @api @regression', async ({ request }) => {
    const response = await request.post(`${env.urls.reqresApi}/users`, {
      headers,
      data: {
        name: 'qa engineer',
        job: 'automation',
      },
    });
    const body = await response.json();

    expect(response.status()).toBe(201);
    expect(reqresUserMutationSchema.safeParse(body).success).toBe(true);
  });

  test('PUT /users/:id updates and returns the submitted fields @api @regression', async ({ request }) => {
    const response = await request.put(`${env.urls.reqresApi}/users/2`, {
      headers,
      data: {
        name: 'qa lead',
        job: 'test architect',
      },
    });
    const body = await response.json();

    expect(response.status()).toBe(200);
    expect(reqresUserMutationSchema.safeParse(body).success).toBe(true);
  });

  test('DELETE /users/:id returns 204 @api @regression', async ({ request }) => {
    const response = await request.delete(`${env.urls.reqresApi}/users/2`, { headers });

    expect(response.status()).toBe(204);
  });

  test('GET /users/999 returns 404 for a missing resource @api @regression', async ({ request }) => {
    const response = await request.get(`${env.urls.reqresApi}/users/999`, { headers });

    expect(response.status()).toBe(404);
  });
});