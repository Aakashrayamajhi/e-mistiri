export const retry = async (fn, retries = 3, delay = 1000) => {
  try {
    return await fn();
  } catch (err) {
    if (retries <= 1) throw err;
    await new Promise((resolve) => setTimeout(resolve, delay));
    return retry(fn, retries - 1, delay);
  }
};

export const withTimeout = (fn, ms) => {
  return async (...args) => {
    return Promise.race([
      fn(...args),
      new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), ms))
    ]);
  };
};

export const withRetry = (fn, retries = 3, delay = 1000) => {
  return async (...args) => {
    return retry(() => fn(...args), retries, delay);
  };
};
