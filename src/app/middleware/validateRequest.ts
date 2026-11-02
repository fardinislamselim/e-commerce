import { type NextFunction, type Request, type Response } from 'express';

import catchAsync from '@app/utils/catchAsync.js';
import type { ZodType } from 'zod';

type RequestWithFiles = Request & {
  files?: unknown;
  file?: unknown;
};

const validateRequest = (schema: ZodType) => {
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