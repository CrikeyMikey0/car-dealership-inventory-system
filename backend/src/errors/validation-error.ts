/**
 * @file validation-error.ts
 * @description Structured validation error class.
 *
 * Extends `AppError` with a list of field-level error details produced
 * by Zod schema parsing.  The global error handler inspects this class
 * and includes the `errors` array in the response body so clients can
 * display per-field validation messages.
 */

import { AppError } from './app-error';

/**
 * Represents a single field-level validation failure.
 */
export interface ValidationErrorItem {
  /** The dot-notation path of the failing field (e.g. "price" or "address.zip"). */
  field: string;
  /** Human-readable description of the validation rule that failed. */
  message: string;
}

/**
 * Thrown when request body or query validation fails against a Zod schema.
 *
 * Always results in an HTTP 400 Bad Request response.  The `errors` array
 * is serialised into the response body so clients can display per-field
 * messages in their forms.
 *
 * @example
 * throw new ValidationError([{ field: 'email', message: 'Invalid email address' }]);
 */
export class ValidationError extends AppError {
  /** Array of individual field-level validation failures. */
  public readonly errors: ValidationErrorItem[];

  /**
   * @param errors - One or more `ValidationErrorItem` objects describing each failure.
   */
  constructor(errors: ValidationErrorItem[]) {
    super(400, 'Validation Error');
    this.errors = errors;
    
    // Restore the correct prototype chain broken by extending built-in Error in ES5 targets.
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
