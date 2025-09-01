// Define a type that extends the built-in Error
export type AppError = Error & { statusCode?: number };

export const errorHandler = (statusCode: number, message: string): AppError => {
  const error = new Error(message) as AppError;
  error.statusCode = statusCode;
  return error;
};
