import { z } from 'zod';

export const validate = (schema, source = 'body') => {
  return (req, res, next) => {
    let data;
    if (source === 'body') data = req.body;
    else if (source === 'params') data = req.params;
    else if (source === 'query') data = req.query;

    const result = schema.safeParse(data);
    if (!result.success) {
      const errors = result.error.flatten().fieldErrors;
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors
      });
    }

    if (source === 'body') {
      req.validatedBody = result.data;
    } else if (source === 'params') {
      req.validatedParams = result.data;
    } else if (source === 'query') {
      req.validatedQuery = result.data;
    }

    next();
  };
};
