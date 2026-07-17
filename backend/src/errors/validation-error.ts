import { AppError } from './app-error';

export interface ValidationErrorItem {
  field: string;
  message: string;
}

export class ValidationError extends AppError {
  public readonly errors: ValidationErrorItem[];

  constructor(errors: ValidationErrorItem[]) {
    super(400, 'Validation Error');
    this.errors = errors;
    
    // Set prototype explicitly
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
