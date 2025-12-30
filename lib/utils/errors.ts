export class AppError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public isOperational = true
  ) {
    super(message);
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export function handleApiError(error: any) {
  if (error instanceof AppError) {
    return { status: 'error', message: error.message };
  }

  if (error.name === 'ZodError') {
    return { status: 'error', message: 'Validation error', errors: error.errors };
  }

  console.error('Unhandled error:', error);
  return { status: 'error', message: 'Internal server error' };
}
