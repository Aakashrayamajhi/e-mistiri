class MockRedis {
  constructor() {
    this.store = {};
  }

  async incr(key) {
    this.store[key] = (this.store[key] || 0) + 1;
    return this.store[key];
  }

  async expire(key, ttl) {
    return 1;
  }

  async pexpire(key, ttl) {
    return 1;
  }

  async pttl(key) {
    return 60000;
  }

  async ttl(key) {
    return 60;
  }

  async set(key, value, mode, ttl) {
    this.store[key] = value;
    return 'OK';
  }

  async get(key) {
    return this.store[key] || null;
  }

  async del(key) {
    delete this.store[key];
    return 1;
  }

  async exists(key) {
    return this.store[key] ? 1 : 0;
  }

  async hSet(key, field, value) {
    if (!this.store[key]) this.store[key] = {};
    this.store[key][field] = value;
    return 1;
  }

  async setEx(key, ttl, value) {
    this.store[key] = value;
    return 'OK';
  }

  async quit() {
    return 'OK';
  }

  async keys(pattern) {
    return Object.keys(this.store).filter(k => k.includes(pattern.replace(/\*/g, '')));
  }
}

export default MockRedis;
