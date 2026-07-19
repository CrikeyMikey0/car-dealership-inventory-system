/**
 * @file validate.middleware.ts
 * @description Reusable Zod-powered request validation middleware factories.
 *
 * Provides two higher-order middleware functions:
 *  - `validateBody`  — validates and sanitises `req.body` against a Zod schema.
 *  - `validateQuery` — validates and sanitises `req.query` against a Zod schema.
 *
 * On success, the **parsed (sanitised)** data is written back to `req.body` /
 * `req.query` so downstream handlers receive typed, safe values rather than
 * the raw strings/unknowns from the HTTP layer.
 *
 * On failure, a `ValidationError` (HTTP 400) is forwarded to the global
 * error handler with per-field error details.
 *
 * @example
 * router.post('/register', validateBody(registerSchema), asyncHandler(controller.register));
 */

import { Request, Response, NextFunction, RequestHandler } from 'express';
import { ZodSchema } from 'zod';
import { ValidationError } from '../errors/validation-error';

/**
 * Creates Express middleware that validates the request body against a Zod schema.
 *
 * If validation passes, `req.body` is replaced with the parsed (and
 * potentially transformed/coerced) output of the schema.
 *
 * If validation fails, a `ValidationError` with per-field messages is
 * forwarded to the next error handler.
 *
 * @param schema - A Zod schema to parse `req.body` against.
 * @returns An Express `RequestHandler` that validates the body before continuing.
 */
export function validateBody(schema: ZodSchema): RequestHandler {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      // Map Zod issues to the flattened field/message format used by ValidationError
      const formattedErrors = result.error.issues.map((issue) => ({
        field: issue.path.join('.'),
        message: issue.message,
      }));
      
      return next(new ValidationError(formattedErrors));
    }

    // Reassign validated and sanitised data back to req.body so downstream
    // handlers receive coerced types and stripped unknown fields.
    req.body = result.data;
    next();
  };
}

/**
 * Creates Express middleware that validates the request query string against a Zod schema.
 *
 * If validation passes, `req.query` is replaced with the parsed output
 * of the schema (e.g. numeric strings coerced to numbers, booleans parsed).
 *
 * If validation fails, a `ValidationError` with per-field messages is
 * forwarded to the next error handler.
 *
 * @param schema - A Zod schema to parse `req.query` against.
 * @returns An Express `RequestHandler` that validates the query string before continuing.
 */
export function validateQuery(schema: ZodSchema): RequestHandler {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.query);

    if (!result.success) {
      // Map Zod issues to the flattened field/message format used by ValidationError
      const formattedErrors = result.error.issues.map((issue) => ({
        field: issue.path.join('.'),
        message: issue.message,
      }));
      
      return next(new ValidationError(formattedErrors));
    }

    // Reassign validated and sanitised data back to req.query so downstream
    // handlers receive correctly typed query parameters.
    req.query = result.data;
    next();
  };
}
