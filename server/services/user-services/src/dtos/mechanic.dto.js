import { z } from 'zod';

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,128}$/;

export const createMechanicSchema = z.object({
  phone: z.string().length(10, 'Phone must be exactly 10 digits'),
  fullname: z.string().min(3, 'Fullname must be at least 3 characters').max(50, 'Fullname must be at most 50 characters'),
  password: z.string().regex(passwordRegex, 'Password must be 8-128 characters with at least one uppercase, one lowercase, one digit, and one special character (@$!%*?&)'),
  email: z.string().email().optional(),
  address: z.string().optional()
});

export const updateMechanicSchema = z.object({
  phone: z.string().length(10).optional(),
  fullname: z.string().min(3).max(50).optional(),
  password: z.string().regex(passwordRegex).optional(),
  email: z.string().email().optional(),
  address: z.string().optional()
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

export const getApprovedSchema = z.object({});

export const approveSchema = z.object({
  id: z.string()
});

export const rejectSchema = z.object({
  id: z.string()
});

export const uploadImageSchema = z.object({});

export const mechanicDTOs = {
  createMechanic: createMechanicSchema,
  updateMechanic: updateMechanicSchema,
  getById: getByIdSchema,
  getByPhone: getByPhoneSchema,
  getAll: getAllSchema,
  getApproved: getApprovedSchema,
  approve: approveSchema,
  reject: rejectSchema,
  uploadImage: uploadImageSchema
};

export default mechanicDTOs;
