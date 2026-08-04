const mockLogger = {
  info: () => {},
  error: () => {},
  warn: () => {},
  debug: () => {},
};

const format = {
  combine: (...fns) => {
    const combined = (...args) => {
      let result = args[0];
      for (const fn of fns) {
        result = fn(result);
      }
      return result;
    };
    combined.timestamp = (...args) => combined(...args);
    combined.errors = (...args) => combined(...args);
    combined.json = (...args) => combined(...args);
    combined.colorize = (...args) => combined(...args);
    combined.printf = (...args) => combined(...args);
    return combined;
  },
  timestamp: (opts = {}) => ({ ...opts }),
  errors: (opts = {}) => ({ ...opts }),
  json: () => ({}),
  colorize: (opts = {}) => ({ ...opts }),
  printf: (fn) => fn,
};

export const createLogger = () => mockLogger;
export const addColors = () => {};
export const transports = { Console: class {}, File: class {} };

export default {
  createLogger,
  addColors,
  format,
  transports,
};
