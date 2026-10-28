import { ZodError } from 'zod';
import { TErrorSources, TGenericErrorResponse } from '../interface/error';

const handleZodError = (err: ZodError): TGenericErrorResponse => {
  const errorSources: TErrorSources = err.issues.map(issue => ({
    path: issue.path.length ? issue.path.join('.') : null,
    message: issue.message,
  }));

  return {
    statusCode: 400,
    message: 'Validation error',
    errorSources,
  };
};

export default handleZodError;
