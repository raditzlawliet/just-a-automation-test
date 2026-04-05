import { z } from 'zod';

export const reqresUserSchema = z.object({
  id: z.number(),
  email: z.string().email(),
  first_name: z.string(),
  last_name: z.string(),
  avatar: z.string().url(),
});

export const reqresUserListSchema = z.object({
  page: z.number(),
  per_page: z.number(),
  total: z.number(),
  total_pages: z.number(),
  data: z.array(reqresUserSchema),
  support: z
    .object({
      url: z.string().url(),
      text: z.string(),
    })
    .optional(),
});

export const reqresLoginSchema = z.object({
  token: z.string().min(1),
});

export const reqresUserMutationSchema = z.object({
  name: z.string(),
  job: z.string(),
  id: z.string().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});