import { z } from 'zod';

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,128}$/;

export const createUserSchema = z.object({
  phone: z.string().length(10, 'Phone must be exactly 10 digits'),
  fullname: z.string().min(3, 'Fullname must be at least 3 characters').max(50, 'Fullname must be at most 50 characters'),
  password: z.string().regex(passwordRegex, 'Password must be 8-128 characters with at least one uppercase, one lowercase, one digit, and one special character (@$!%*?&)')
});

export const updateUserSchema = z.object({
  fullname: z.string().min(3).max(50).optional(),
  phone: z.string().length(10).optional(),
  password: z.string().regex(passwordRegex).optional()
});

export const getByIdSchema = z.object({
  id: z.string()
});

export const getByPhoneSchema = z.object({
  phone: z.string().length(10)
});

export const getAllSchema = z.object({
  limit: z.number().optional(),
  skip: z.number().optional()
});

export const userDTOs = {
  createUser: createUserSchema,
  updateUser: updateUserSchema,
  getById: getByIdSchema,
  getByPhone: getByPhoneSchema,
  getAll: getAllSchema
};

export default userDTOs;
