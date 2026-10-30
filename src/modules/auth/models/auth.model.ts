import { z } from 'zod';

/* ─────────────────────────────────────────────
   LOGIN
───────────────────────────────────────────── */
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Invalid email address')
    .toLowerCase()
    .trim(),
  password: z.string().min(1, 'Password is required'),
});

export type LoginForm = z.infer<typeof loginSchema>;

/* ─────────────────────────────────────────────
   REGISTER
───────────────────────────────────────────── */
export const registerSchema = z
  .object({
    firstName: z
      .string()
      .min(2, 'First name must be at least 2 characters')
      .max(50, 'First name is too long')
      .trim(),

    lastName: z
      .string()
      .min(2, 'Last name must be at least 2 characters')
      .max(50, 'Last name is too long')
      .trim(),

    email: z
      .string()
      .min(1, 'Email is required')
      .email('Invalid email address')
      .toLowerCase()
      .trim(),

    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .max(72, 'Password is too long')
      .regex(/[A-Z]/, 'Must contain an uppercase letter')
      .regex(/[a-z]/, 'Must contain a lowercase letter')
      .regex(/[0-9]/, 'Must contain a number')
      .regex(/[^A-Za-z0-9]/, 'Must contain a special character'),

    // ⚠️ Required — backend validator expects this field
    confirmPassword: z.string().min(1, 'Please confirm your password'),

    phone: z
      .string()
      .regex(
        /^\+?[1-9]\d{1,14}$/,
        'Phone must be in international format (e.g. +8801712345678)',
      )
      .optional()
      .or(z.literal('')),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type RegisterForm = z.infer<typeof registerSchema>;