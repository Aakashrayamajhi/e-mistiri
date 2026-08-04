import sendMessageSchema from '../src/dtos/chat.dto.js';

describe('Chat DTOs', () => {
  describe('sendMessageSchema', () => {
    it('should accept valid message data', () => {
      const data = {
        msg: 'Hello world',
        to: 'user123',
        senderId: 'user456'
      };
      expect(() => sendMessageSchema.parse(data)).not.toThrow();
    });

    it('should reject empty message', () => {
      expect(() => sendMessageSchema.parse({
        msg: '',
        to: 'user123',
        senderId: 'user456'
      })).toThrow();
    });

    it('should reject message exceeding max length', () => {
      expect(() => sendMessageSchema.parse({
        msg: 'A'.repeat(5001),
        to: 'user123',
        senderId: 'user456'
      })).toThrow();
    });

    it('should reject missing to field', () => {
      expect(() => sendMessageSchema.parse({
        msg: 'Hello',
        senderId: 'user456'
      })).toThrow();
    });

    it('should reject missing senderId field', () => {
      expect(() => sendMessageSchema.parse({
        msg: 'Hello',
        to: 'user123'
      })).toThrow();
    });

    it('should reject non-string msg', () => {
      expect(() => sendMessageSchema.parse({
        msg: 123,
        to: 'user123',
        senderId: 'user456'
      })).toThrow();
    });

    it('should reject non-string to', () => {
      expect(() => sendMessageSchema.parse({
        msg: 'Hello',
        to: 123,
        senderId: 'user456'
      })).toThrow();
    });

    it('should reject non-string senderId', () => {
      expect(() => sendMessageSchema.parse({
        msg: 'Hello',
        to: 'user123',
        senderId: 123
      })).toThrow();
    });

    it('should accept message exactly at max length', () => {
      expect(() => sendMessageSchema.parse({
        msg: 'A'.repeat(5000),
        to: 'user123',
        senderId: 'user456'
      })).not.toThrow();
    });
  });
});
