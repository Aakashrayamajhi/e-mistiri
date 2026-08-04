export const withTimeout = (fn, ms = 10000) => {
  return async (...args) => {
    return Promise.race([
      fn(...args),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Request timeout')), ms)
      )
    ]);
  };
};
