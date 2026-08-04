import { z } from 'zod';

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,128}$/;

export const createGarageSchema = z.object({
  phone: z.string().length(10, 'Phone must be exactly 10 digits'),
  fullname: z.string().min(3, 'Fullname must be at least 3 characters').max(50, 'Fullname must be at most 50 characters'),
  password: z.string().regex(passwordRegex, 'Password must be 8-128 characters with at least one uppercase, one lowercase, one digit, and one special character (@$!%*?&)'),
  ownerName: z.string().min(2, 'Owner name must be at least 2 characters'),
  email: z.string().email().optional(),
  address: z.string(),
  city: z.string(),
  description: z.string().optional(),
  location: z.object({
    coordinates: z.array(z.number()).length(2, 'Coordinates must be [lng, lat]')
  }),
  services: z.array(z.string()),
  openingTime: z.string(),
  closingTime: z.string(),
  isOpen24Hours: z.boolean(),
  documents: z.object({
    registrationCertificate: z.string().optional(),
    citizenshipFront: z.string().optional(),
    citizenshipBack: z.string().optional(),
    panNumber: z.string().optional(),
    vatNumber: z.string().optional()
  }).optional(),
  paymentDetails: z.object({
    bankName: z.string().optional(),
    accountHolderName: z.string().optional(),
    accountNumber: z.string().optional(),
    branch: z.string().optional(),
    esewaId: z.string().optional(),
    khaltiId: z.string().optional()
  }).optional()
});

export const updateGarageSchema = createGarageSchema.partial();

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

export const getNearbySchema = z.object({
  lng: z.number(),
  lat: z.number(),
  maxDistance: z.number().optional()
});

export const approveSchema = z.object({
  id: z.string()
});

export const rejectSchema = z.object({
  id: z.string()
});

export const uploadImageSchema = z.object({});

export const garageDTOs = {
  createGarage: createGarageSchema,
  updateGarage: updateGarageSchema,
  getById: getByIdSchema,
  getByPhone: getByPhoneSchema,
  getAll: getAllSchema,
  getApproved: getApprovedSchema,
  getNearby: getNearbySchema,
  approve: approveSchema,
  reject: rejectSchema,
  uploadImage: uploadImageSchema
};

export default garageDTOs;
