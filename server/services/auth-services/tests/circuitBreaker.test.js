import { createCircuitBreaker, withCircuitBreaker } from '../src/utils/circuitBreaker.js';

describe('Circuit Breaker', () => {
  it('should create a circuit breaker', () => {
    const fn = () => 'success';
    const breaker = createCircuitBreaker(fn);
    expect(breaker).toBeDefined();
    expect(breaker.fire).toBeDefined();
  });

  it('should call function through circuit breaker', async () => {
    const fn = async () => 'success';
    const breaker = createCircuitBreaker(fn);
    const result = await breaker.fire();
    expect(result).toBe('success');
  });

  it('should return fallback on failure when configured', async () => {
    const fn = async () => { throw new Error('fail'); };
    const breaker = createCircuitBreaker(fn);
    const result = await breaker.fire();
    expect(result).toBeDefined();
  });

  it('should register event listeners', () => {
    const fn = () => 'success';
    const breaker = createCircuitBreaker(fn);
    expect(breaker.on).toBeDefined();
    expect(() => breaker.on('open', () => {})).not.toThrow();
  });

  it('withCircuitBreaker should return a bound function', () => {
    const fn = async () => 'success';
    const bound = withCircuitBreaker(fn);
    expect(typeof bound).toBe('function');
  });
});
