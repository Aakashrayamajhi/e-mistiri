import CircuitBreaker from 'opossum';

const circuitOptions = {
  errorThresholdPercentage: 50,
  resetTimeout: 30000,
  timeout: 5000,
  fallback: () => ({
    fallback: true,
    data: null
  })
};

export const createCircuitBreaker = (fn) => {
  const breaker = new CircuitBreaker(fn, circuitOptions);
  return breaker;
};

export const withCircuitBreaker = (fn) => {
  const breaker = new CircuitBreaker(fn, {
    errorThresholdPercentage: 50,
    resetTimeout: 30000,
    timeout: 5000,
    fallback: () => ({
      fallback: true,
      data: null
    })
  });
  return breaker.fire.bind(breaker);
};
