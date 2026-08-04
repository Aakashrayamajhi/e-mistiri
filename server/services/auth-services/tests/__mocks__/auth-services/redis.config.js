const calls = [];
const mockRedis = {
  incr: async () => 1,
  expire: async () => 1,
  pexpire: async () => 1,
  pttl: async () => 60000,
  ttl: async () => 60,
  set: async (...args) => { calls.push({ method: 'set', args }); return 'OK'; },
  get: async (...args) => { calls.push({ method: 'get', args }); return null; },
  del: async (...args) => { calls.push({ method: 'del', args }); return 1; },
  exists: async (...args) => { calls.push({ method: 'exists', args }); return 0; },
  hSet: async (...args) => { calls.push({ method: 'hSet', args }); return 1; },
  setEx: async (...args) => { calls.push({ method: 'setEx', args }); return 'OK'; },
  quit: async () => 'OK',
};

export const getCalls = () => calls;
export const clearCalls = () => calls.length = 0;
export const configureMock = (overrides = {}) => Object.assign(mockRedis, overrides);

export default mockRedis;
