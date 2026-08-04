import { ZodError } from 'zod';

export const validate = (schema) => {
  return (req, res, next) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const details = (error.issues || error.errors || []).map((err) => ({
          field: Array.isArray(err.path) ? err.path.join('.') : String(err.path),
          message: err.message
        }));
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          details
        });
      }
      next(error);
    }
  };
};
