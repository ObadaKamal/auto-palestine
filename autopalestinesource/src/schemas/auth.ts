import { z } from 'zod';

export const sessionRoles = ['owner', 'admin'] as const;

export const loginSchema = z.object({
  email: z.string().min(1, 'required').email('email'),
  password: z.string().min(6, 'passwordMin'),
  role: z.enum(sessionRoles),
  locale: z.string(),
});

export const registerSchema = z.object({
  name: z.string().min(2, 'required'),
  email: z.string().min(1, 'required').email('email'),
  phone: z.string().min(6, 'phoneInvalid'),
  password: z.string().min(6, 'passwordMin'),
  locale: z.string(),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
