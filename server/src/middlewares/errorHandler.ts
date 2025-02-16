import { Request, Response, NextFunction } from 'express';

export const errorHandler = (err: unknown, req: Request, res: Response, _next: NextFunction) => {
  // eslint-disable-next-line no-console
  console.error('Server Error:', err);
  const errorMessage = err instanceof Error ? err.message : 'Internal Server Error';
  res.status(500).json({ error: errorMessage });
};
