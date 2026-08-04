import { jest } from '@jest/globals';

export default class MockRedis {
  constructor() {
    this.incr = jest.fn(async () => 1);
    this.expire = jest.fn(async () => 1);
    this.pexpire = jest.fn(async () => 1);
    this.pttl = jest.fn(async () => 60000);
    this.ttl = jest.fn(async () => 60);
    this.set = jest.fn(async () => 'OK');
    this.get = jest.fn(async () => null);
    this.del = jest.fn(async () => 1);
    this.exists = jest.fn(async () => 0);
    this.hSet = jest.fn(async () => 1);
    this.setEx = jest.fn(async () => 'OK');
    this.quit = jest.fn(async () => 'OK');
  }
}
