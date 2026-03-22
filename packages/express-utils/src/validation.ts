import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';

export interface ValidationErrorResponse {
  ok: false;
  error: 'validation_error';
  details: Array<{
    path: (string | number)[];
    message: string;
  }>;
}

export function validateBody<T>(schema: ZodSchema<T>) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const response: ValidationErrorResponse = {
          ok: false,
          error: 'validation_error',
          details: error.issues.map((issue) => ({
            path: issue.path,
            message: issue.message,
          })),
        };
        return res.status(400).json(response);
      }
      throw error;
    }
  };
}

export function formatZodError(error: ZodError): ValidationErrorResponse {
  return {
    ok: false,
    error: 'validation_error',
    details: error.issues.map((issue) => ({
      path: issue.path,
      message: issue.message,
    })),
  };
}
