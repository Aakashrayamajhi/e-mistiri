import { z } from "zod";

const validators = {};

export const validateSocketEvent = (eventName, schema) => {
  if (validators[eventName]) {
    return validators[eventName];
  }

  const middleware = (data, callback) => {
    const result = schema.safeParse(data);
    if (!result.success) {
      return callback(new Error(`Validation failed for ${eventName}: ${result.error.issues.map(e => e.message).join(", ")}`), false);
    }
    return callback(null, result.data);
  };

  validators[eventName] = middleware;
  return middleware;
};
