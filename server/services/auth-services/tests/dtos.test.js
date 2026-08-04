import { signupSchema, verifyOTPSchema, loginSchema, refreshTokenSchema } from '../src/dtos/userAuth.dto.js';
import { z } from 'zod';

describe('Auth DTOs', () => {
  describe('signupSchema', () => {
    it('should accept valid signup data', () => {
      const data = {
        phone: '9876543210',
        fullname: 'John Doe',
        password: 'ValidPass1!',
        otp: '123456'
      };
      expect(() => signupSchema.parse(data)).not.toThrow();
    });

    it('should reject phone shorter than 10 digits', () => {
      expect(() => signupSchema.parse({
        phone: '987654321',
        fullname: 'John Doe',
        password: 'ValidPass1!'
      })).toThrow();
    });

    it('should reject phone longer than 10 digits', () => {
      expect(() => signupSchema.parse({
        phone: '98765432101',
        fullname: 'John Doe',
        password: 'ValidPass1!'
      })).toThrow();
    });

    it('should reject fullname shorter than 3 characters', () => {
      expect(() => signupSchema.parse({
        phone: '9876543210',
        fullname: 'Jo',
        password: 'ValidPass1!'
      })).toThrow();
    });

    it('should reject password without uppercase', () => {
      expect(() => signupSchema.parse({
        phone: '9876543210',
        fullname: 'John Doe',
        password: 'validpass1!'
      })).toThrow();
    });

    it('should reject password without lowercase', () => {
      expect(() => signupSchema.parse({
        phone: '9876543210',
        fullname: 'John Doe',
        password: 'VALIDPASS1!'
      })).toThrow();
    });

    it('should reject password without number', () => {
      expect(() => signupSchema.parse({
        phone: '9876543210',
        fullname: 'John Doe',
        password: 'ValidPass!'
      })).toThrow();
    });

    it('should reject password without special character', () => {
      expect(() => signupSchema.parse({
        phone: '9876543210',
        fullname: 'John Doe',
        password: 'ValidPass1'
      })).toThrow();
    });

    it('should reject password shorter than 8 characters', () => {
      expect(() => signupSchema.parse({
        phone: '9876543210',
        fullname: 'John Doe',
        password: 'Val1!'
      })).toThrow();
    });

    it('should reject password longer than 128 characters', () => {
      expect(() => signupSchema.parse({
        phone: '9876543210',
        fullname: 'John Doe',
        password: 'A'.repeat(129) + 'a1!'
      })).toThrow();
    });

    it('should reject extra fields (strict mode)', () => {
      expect(() => signupSchema.parse({
        phone: '9876543210',
        fullname: 'John Doe',
        password: 'ValidPass1!',
        extra: 'should fail'
      })).toThrow();
    });
  });

  describe('verifyOTPSchema', () => {
    it('should accept valid OTP data', () => {
      expect(() => verifyOTPSchema.parse({ phone: '9876543210', otp: '123456' })).not.toThrow();
    });

    it('should reject OTP shorter than 6 digits', () => {
      expect(() => verifyOTPSchema.parse({ phone: '9876543210', otp: '12345' })).toThrow();
    });

    it('should reject OTP longer than 6 digits', () => {
      expect(() => verifyOTPSchema.parse({ phone: '9876543210', otp: '1234567' })).toThrow();
    });
  });

  describe('loginSchema', () => {
    it('should accept valid login data', () => {
      expect(() => loginSchema.parse({ phone: '9876543210', password: 'anypassword' })).not.toThrow();
    });

    it('should reject missing password', () => {
      expect(() => loginSchema.parse({ phone: '9876543210' })).toThrow();
    });

    it('should reject extra fields', () => {
      expect(() => loginSchema.parse({ phone: '9876543210', password: 'anypassword', extra: 'x' })).toThrow();
    });
  });

  describe('refreshTokenSchema', () => {
    it('should accept valid refresh token data', () => {
      expect(() => refreshTokenSchema.parse({ refreshToken: 'some-token' })).not.toThrow();
    });

    it('should reject missing refresh token', () => {
      expect(() => refreshTokenSchema.parse({})).toThrow();
    });

    it('should reject extra fields', () => {
      expect(() => refreshTokenSchema.parse({ refreshToken: 'some-token', extra: 'x' })).toThrow();
    });
  });
});
