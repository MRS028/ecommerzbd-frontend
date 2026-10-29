import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Minimum 6 characters'),
});

export const registerSchema = z.object({
  firstName: z.string().min(1, 'First name required'),
  lastName: z.string().min(1, 'Last name required'),
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Minimum 6 characters'),
  phone: z.string().optional(),
});

export type LoginForm = z.infer<typeof loginSchema>;
export type RegisterForm = z.infer<typeof registerSchema>;