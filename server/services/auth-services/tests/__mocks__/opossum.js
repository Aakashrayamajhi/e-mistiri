export default class CircuitBreaker {
  constructor(fn, options = {}) {
    this.fn = fn;
    this.options = options;
    if (options.fallback) {
      this.fallbackFn = options.fallback;
    }
  }
  fallback(fn) {
    this.fallbackFn = fn;
  }
  on(event, cb) {}
  async fire(...args) {
    try {
      return await this.fn(...args);
    } catch (e) {
      if (this.fallbackFn) return this.fallbackFn();
      throw e;
    }
  }
}
