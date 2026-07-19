/**
 * @file express.d.ts
 * @description Augments the Express `Request` interface to include the authenticated user.
 *
 * After the `authenticate` middleware runs, it attaches the logged-in user
 * (without the password hash) to `req.user`.  Without this declaration
 * TypeScript would not know about the property, causing type errors in
 * controllers and other middleware that access `req.user`.
 *
 * The password field is excluded via `Omit<User, 'password'>` so that
 * handlers cannot accidentally expose the hash even if they tried.
 */

import { User } from '@prisma/client';

declare global {
  namespace Express {
    interface Request {
      /**
       * The authenticated user, populated by the `authenticate` middleware.
       * `undefined` on routes that do not require authentication.
       * The `password` field is intentionally omitted for security.
       */
      user?: Omit<User, 'password'>;
    }
  }
}
