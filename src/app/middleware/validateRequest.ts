import { NextFunction, Request, Response } from 'express';
import { ZodTypeAny } from 'zod';
import catchAsync from '../utils/catchAsync';

type RequestWithFiles = Request & {
  files?: unknown;
  file?: unknown;
};

const validateRequest = (schema: ZodTypeAny) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const request = req as RequestWithFiles;

    await schema.parseAsync({
      body: req.body,
      files: request.files,
      file: request.file,
      cookies: req.cookies,
      query: req.query,
      params: req.params,
    });

    next();
  });
};

export default validateRequest;