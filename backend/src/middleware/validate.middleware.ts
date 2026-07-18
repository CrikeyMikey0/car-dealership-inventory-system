import { Request, Response, NextFunction, RequestHandler } from 'express';
import { ZodSchema } from 'zod';
import { ValidationError } from '../errors/validation-error';

/**
 * Reusable request body validation middleware using Zod schemas.
 */
export function validateBody(schema: ZodSchema): RequestHandler {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const formattedErrors = result.error.issues.map((issue) => ({
        field: issue.path.join('.'),
        message: issue.message,
      }));
      
      return next(new ValidationError(formattedErrors));
    }

    // Reassign validated and sanitized data back to req.body
    req.body = result.data;
    next();
  };
}

/**
 * Reusable request query validation middleware using Zod schemas.
 */
export function validateQuery(schema: ZodSchema): RequestHandler {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.query);

    if (!result.success) {
      const formattedErrors = result.error.issues.map((issue) => ({
        field: issue.path.join('.'),
        message: issue.message,
      }));
      
      return next(new ValidationError(formattedErrors));
    }

    // Reassign validated and sanitized data back to req.query
    req.query = result.data;
    next();
  };
}
