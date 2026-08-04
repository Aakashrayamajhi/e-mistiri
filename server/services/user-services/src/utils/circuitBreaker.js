import CircuitBreaker from 'opossum';

export const createCircuitBreaker = (action, options = {}) => {
  const breaker = new CircuitBreaker(action, {
    timeout: options.timeout || 3000,
    errorThresholdPercentage: options.errorThresholdPercentage || 50,
    resetTimeout: options.resetTimeout || 30000,
    ...options
  });
  return breaker;
};
