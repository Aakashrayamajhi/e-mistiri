const mockRedis = {
  incr: async () => 1,
  expire: async () => 1,
  pexpire: async () => 1,
  pttl: async () => 60000,
  ttl: async () => 60,
  set: async () => 'OK',
  get: async () => null,
  del: async () => 1,
  exists: async () => 0,
  hSet: async () => 1,
  setEx: async () => 'OK',
  quit: async () => 'OK',
};

export default class MockRedis {
  constructor() {
    return mockRedis;
  }
}
