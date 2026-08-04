import { z } from 'zod';

const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,128}$/;

describe('Password Security Rules', () => {
  const validPasswords = [
    'ValidPass1!',
    'MyP@ssw0rd',
    'Str0ng!Pass',
    'Abcdef1!',
    'Zyxwvu9@'
  ];

  const invalidPasswords = [
    { password: 'short1!', reason: 'too short' },
    { password: 'A'.repeat(130) + 'a1!', reason: 'too long' },
    { password: 'nouppercase1!', reason: 'no uppercase' },
    { password: 'NOLOWERCASE1!', reason: 'no lowercase' },
    { password: 'NoNumbers!', reason: 'no number' },
    { password: 'NoSpecialChar1', reason: 'no special char' },
    { password: 'validpass1!', reason: 'no uppercase' },
    { password: 'VALIDPASS1!', reason: 'no lowercase' },
    { password: 'ValidPassword', reason: 'no number and no special' },
  ];

  it('should accept valid passwords', () => {
    validPasswords.forEach(password => {
      expect(PASSWORD_REGEX.test(password)).toBe(true);
    });
  });

  it('should reject invalid passwords', () => {
    invalidPasswords.forEach(({ password }) => {
      expect(PASSWORD_REGEX.test(password)).toBe(false);
    });
  });

  it('should reject empty string', () => {
    expect(PASSWORD_REGEX.test('')).toBe(false);
  });

  it('should reject null', () => {
    expect(PASSWORD_REGEX.test(null)).toBe(false);
  });

  it('should reject non-string values', () => {
    expect(PASSWORD_REGEX.test(12345)).toBe(false);
    expect(PASSWORD_REGEX.test({})).toBe(false);
    expect(PASSWORD_REGEX.test([])).toBe(false);
  });

  it('should accept exactly 8 characters', () => {
    expect(PASSWORD_REGEX.test('Abc1!xyz')).toBe(true);
  });

  it('should accept exactly 128 characters', () => {
    const pwd = 'A'.repeat(125) + 'a1!';
    expect(pwd.length).toBe(128);
    expect(PASSWORD_REGEX.test(pwd)).toBe(true);
  });

  it('should reject 129 characters', () => {
    const pwd = 'A'.repeat(126) + 'a1!';
    expect(pwd.length).toBe(129);
    expect(PASSWORD_REGEX.test(pwd)).toBe(false);
  });
});
