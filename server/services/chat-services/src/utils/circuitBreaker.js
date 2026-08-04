import CircuitBreaker from "opossum";

const circuitOptions = {
  errorThresholdPercentage: 50,
  resetTimeout: 30000,
  timeout: 5000,
};

const createBreaker = (fn) => new CircuitBreaker(fn, circuitOptions);

export const mongoBreaker = createBreaker(async (fn) => fn());
export const kafkaBreaker = createBreaker(async (fn) => fn());
