import { jest } from '@jest/globals';
import { validateSocketEvent } from '../src/middleware/validation.middleware.js';
import sendMessageSchema from '../src/dtos/chat.dto.js';

describe('Socket Validation', () => {
  it('should validate sendingmessage event with valid data', () => {
    const validateSendMessage = validateSocketEvent('sendingmessage', sendMessageSchema);
    const callback = jest.fn();

    validateSendMessage({ msg: 'Hello', to: 'user123', senderId: 'user456' }, callback);
    expect(callback).toHaveBeenCalledWith(null, { msg: 'Hello', to: 'user123', senderId: 'user456' });
  });

  it('should reject invalid sendingmessage data', () => {
    const validateSendMessage = validateSocketEvent('sendingmessage', sendMessageSchema);
    const callback = jest.fn();

    validateSendMessage({ msg: '', to: 'user123', senderId: 'user456' }, callback);
    expect(callback).toHaveBeenCalledWith(expect.any(Error), false);
    expect(callback.mock.calls[0][0].message).toMatch(/Validation failed/);
  });

  it('should reject missing to field', () => {
    const validateSendMessage = validateSocketEvent('sendingmessage', sendMessageSchema);
    const callback = jest.fn();

    validateSendMessage({ msg: 'Hello', senderId: 'user456' }, callback);
    expect(callback).toHaveBeenCalledWith(expect.any(Error), false);
  });

  it('should reject missing senderId field', () => {
    const validateSendMessage = validateSocketEvent('sendingmessage', sendMessageSchema);
    const callback = jest.fn();

    validateSendMessage({ msg: 'Hello', to: 'user123' }, callback);
    expect(callback).toHaveBeenCalledWith(expect.any(Error), false);
  });

  it('should reject message exceeding max length', () => {
    const validateSendMessage = validateSocketEvent('sendingmessage', sendMessageSchema);
    const callback = jest.fn();

    validateSendMessage({ msg: 'A'.repeat(5001), to: 'user123', senderId: 'user456' }, callback);
    expect(callback).toHaveBeenCalledWith(expect.any(Error), false);
  });

  it('should cache validator for same event name', () => {
    const validate1 = validateSocketEvent('sendingmessage', sendMessageSchema);
    const validate2 = validateSocketEvent('sendingmessage', sendMessageSchema);
    expect(validate1).toBe(validate2);
  });
});
