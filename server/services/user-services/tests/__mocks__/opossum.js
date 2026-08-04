export default class CircuitBreaker {
  constructor(fn, options) {
    this.fn = fn;
  }
  fallback(fn) {
    this.fallbackFn = fn;
  }
  on(event, cb) {}
  fire(...args) {
    try {
      return this.fn(...args);
    } catch (e) {
      if (this.fallbackFn) return this.fallbackFn();
      throw e;
    }
  }
}
