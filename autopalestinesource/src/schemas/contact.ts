import { z } from 'zod';

export const contactSchema = z.object({
  name: z.string().min(2, 'required'),
  email: z.string().min(1, 'required').email('email'),
  message: z.string().min(10, 'messageMin'),
});

export type ContactInput = z.infer<typeof contactSchema>;
