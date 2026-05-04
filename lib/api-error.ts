import { NextResponse } from 'next/server';
import { ZodError } from 'zod';

export class ApiError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public code?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export function handleApiError(error: unknown): NextResponse {
  console.error('API Error:', error);

  // Handle custom API errors
  if (error instanceof ApiError) {
    return NextResponse.json(
      {
        error: error.message,
        code: error.code,
      },
      { status: error.statusCode }
    );
  }

  // Handle Zod validation errors
  if (error instanceof ZodError) {
    return NextResponse.json(
      {
        error: 'Validation failed',
        code: 'VALIDATION_ERROR',
        details: error.issues.map((err: any) => ({
          path: err.path.join('.'),
          message: err.message,
        })),
      },
      { status: 400 }
    );
  }

  // Handle Prisma errors
  if (typeof error === 'object' && error !== null && 'code' in error) {
    const prismaError = error as { code: string; meta?: any };
    switch (prismaError.code) {
      case 'P2002':
        return NextResponse.json(
          {
            error: 'A record with this value already exists',
            code: 'DUPLICATE_ERROR',
          },
          { status: 409 }
        );
      case 'P2025':
        return NextResponse.json(
          {
            error: 'Record not found',
            code: 'NOT_FOUND',
          },
          { status: 404 }
        );
      default:
        if (prismaError.code.startsWith('P')) {
          return NextResponse.json(
            {
              error: 'Database error',
              code: 'DATABASE_ERROR',
            },
            { status: 500 }
          );
        }
    }
  }

  // Handle generic errors
  if (error instanceof Error) {
    return NextResponse.json(
      {
        error: error.message,
        code: 'INTERNAL_ERROR',
      },
      { status: 500 }
    );
  }

  // Unknown error
  return NextResponse.json(
    {
      error: 'An unexpected error occurred',
      code: 'UNKNOWN_ERROR',
    },
    { status: 500 }
  );
}

// Common error responses
export const errors = {
  unauthorized: () =>
    new ApiError(401, 'Unauthorized', 'UNAUTHORIZED'),
  forbidden: () =>
    new ApiError(403, 'Forbidden', 'FORBIDDEN'),
  notFound: (resource = 'Resource') =>
    new ApiError(404, `${resource} not found`, 'NOT_FOUND'),
  badRequest: (message = 'Bad request') =>
    new ApiError(400, message, 'BAD_REQUEST'),
  rateLimitExceeded: () =>
    new ApiError(429, 'Too many requests', 'RATE_LIMIT_EXCEEDED'),
  internalError: (message = 'Internal server error') =>
    new ApiError(500, message, 'INTERNAL_ERROR'),
};
