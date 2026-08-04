import { z } from 'zod';

const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,128}$/;

export const signupSchema = z.object({
  phone: z.string().min(10).max(10),
  fullname: z.string().min(3).max(50),
  password: z.string().regex(PASSWORD_REGEX),
  email: z.string().email().optional(),
  otp: z.string().length(6).optional()
}).strict();

export const verifyOTPSchema = z.object({
  phone: z.string().min(10).max(10),
  otp: z.string().length(6)
}).strict();

export const loginSchema = z.object({
  phone: z.string().min(10).max(10),
  password: z.string()
}).strict();

export const refreshTokenSchema = z.object({
  refreshToken: z.string()
}).strict();
