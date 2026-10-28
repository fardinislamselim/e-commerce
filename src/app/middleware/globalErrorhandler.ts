import { ErrorRequestHandler } from 'express';
import httpStatus from 'http-status';
import { ZodError } from 'zod';
import AppError from '../error/AppError';
import handleDuplicateError from '../error/DuplicateError';
import handleZodError from '../error/ZodError';
import ValidationError, {
  toValidationResponse,
} from '../error/ValidationError';
import { TErrorSources, TGenericErrorResponse } from '../interface/error';

const globalErrorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  let statusCode: number = httpStatus.INTERNAL_SERVER_ERROR;
  let message = 'Something went wrong';
  let errorSources: TErrorSources = [{ path: null, message }];

  if (err instanceof ZodError) {
    const result = handleZodError(err);
    statusCode = result.statusCode;
    message = result.message;
    errorSources = result.errorSources;
  } else if (err instanceof ValidationError) {
    const result = toValidationResponse(err);
    statusCode = result.statusCode;
    message = result.message;
    errorSources = result.errorSources;
  } else if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
    errorSources = [{ path: null, message }];
  } else if (err?.code === 'P2002') {
    const result: TGenericErrorResponse = handleDuplicateError(err);
    statusCode = result.statusCode;
    message = result.message;
    errorSources = result.errorSources;
  } else if (err instanceof Error) {
    message = err.message;
    errorSources = [{ path: null, message }];
  }

  res.status(statusCode).json({
    success: false,
    message,
    errorSources,
    ...(process.env.NODE_ENV === 'development' && {
      stack: err instanceof Error ? err.stack : undefined,
    }),
  });
};

export default globalErrorHandler;
