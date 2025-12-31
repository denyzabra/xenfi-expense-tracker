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

export function handleApiError(error: unknown) {
  if (error instanceof AppError) {
    return { status: 'error', message: error.message };
  }

  if (error && typeof error === 'object' && 'name' in error && error.name === 'ZodError' && 'errors' in error) {
    return { status: 'error', message: 'Validation error', errors: error.errors };
  }

  console.error('Unhandled error:', error);
  return { status: 'error', message: 'Internal server error' };
}
