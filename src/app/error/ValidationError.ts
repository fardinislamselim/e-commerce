import { TErrorSources, TGenericErrorResponse } from '../interface/error';

class ValidationError extends Error {
  public statusCode: number;
  public errorSources: TErrorSources;

  constructor(message: string, errorSources: TErrorSources = []) {
    super(message);
    this.name = 'ValidationError';
    this.statusCode = 400;
    this.errorSources = errorSources;
    Error.captureStackTrace(this, this.constructor);
  }
}

export const toValidationResponse = (
  error: ValidationError,
): TGenericErrorResponse => ({
  statusCode: error.statusCode,
  message: error.message,
  errorSources: error.errorSources,
});

export default ValidationError;
