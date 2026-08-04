import userDTOs from '../src/dtos/user.dto.js';
import { z } from 'zod';

describe('User DTOs', () => {
  describe('createUserSchema', () => {
    it('should accept valid data', () => {
      const data = {
        phone: '9876543210',
        fullname: 'John Doe',
        password: 'ValidPass1!'
      };
      expect(() => userDTOs.createUser.parse(data)).not.toThrow();
    });

    it('should reject phone not exactly 10 digits', () => {
      expect(() => userDTOs.createUser.parse({
        phone: '987654321',
        fullname: 'John Doe',
        password: 'ValidPass1!'
      })).toThrow();
    });

    it('should reject fullname shorter than 3 characters', () => {
      expect(() => userDTOs.createUser.parse({
        phone: '9876543210',
        fullname: 'Jo',
        password: 'ValidPass1!'
      })).toThrow();
    });

    it('should reject fullname longer than 50 characters', () => {
      expect(() => userDTOs.createUser.parse({
        phone: '9876543210',
        fullname: 'A'.repeat(51),
        password: 'ValidPass1!'
      })).toThrow();
    });

    it('should reject weak password', () => {
      expect(() => userDTOs.createUser.parse({
        phone: '9876543210',
        fullname: 'John Doe',
        password: 'weak'
      })).toThrow();
    });
  });

  describe('updateUserSchema', () => {
    it('should accept partial update', () => {
      expect(() => userDTOs.updateUser.parse({ fullname: 'Jane Doe' })).not.toThrow();
    });

    it('should accept empty object', () => {
      expect(() => userDTOs.updateUser.parse({})).not.toThrow();
    });
  });

  describe('getByIdSchema', () => {
    it('should accept valid id', () => {
      expect(() => userDTOs.getById.parse({ id: '12345' })).not.toThrow();
    });

    it('should reject missing id', () => {
      expect(() => userDTOs.getById.parse({})).toThrow();
    });
  });

  describe('getByPhoneSchema', () => {
    it('should accept valid phone', () => {
      expect(() => userDTOs.getByPhone.parse({ phone: '9876543210' })).not.toThrow();
    });

    it('should reject invalid phone length', () => {
      expect(() => userDTOs.getByPhone.parse({ phone: '987654321' })).toThrow();
    });
  });

  describe('getAllSchema', () => {
    it('should accept empty query', () => {
      expect(() => userDTOs.getAll.parse({})).not.toThrow();
    });

    it('should accept limit and skip', () => {
      expect(() => userDTOs.getAll.parse({ limit: 10, skip: 0 })).not.toThrow();
    });
  });
});
