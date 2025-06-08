import { Request, Response, NextFunction } from 'express';

export interface ApiError extends Error {
  statusCode?: number;
  isOperational?: boolean;
}

export function createError(message: string, statusCode: number = 500): ApiError {
  const error: ApiError = new Error(message);
  error.statusCode = statusCode;
  error.isOperational = true;
  return error;
}

export function errorHandler(
  err: ApiError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  const isOperational = err.isOperational || false;

  console.error('Error:', {
    message: err.message,
    statusCode,
    stack: err.stack,
    isOperational,
  });

  res.status(statusCode).json({
    error: {
      message: isOperational ? message : 'Internal Server Error',
      statusCode,
      ...(process.env.NODE_ENV === 'development' && {
        stack: err.stack,
      }),
    },
  });
}