import { jest } from '@jest/globals';

const mockRedis = {
  incr: jest.fn(async () => 1),
  expire: jest.fn(async () => 1),
  pexpire: jest.fn(async () => 1),
  pttl: jest.fn(async () => 60000),
  ttl: jest.fn(async () => 60),
  set: jest.fn(async () => 'OK'),
  get: jest.fn(async () => null),
  del: jest.fn(async () => 1),
  exists: jest.fn(async () => 0),
  hSet: jest.fn(async () => 1),
  setEx: jest.fn(async () => 'OK'),
  quit: jest.fn(async () => 'OK'),
};

export default class MockRedis {
  constructor() {
    return mockRedis;
  }
}
