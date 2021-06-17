import { Request, Response, NextFunction } from 'express';
import { AccessDeniedError } from '../errors/accessDeniedError';

export const isLoggedIn = (req: Request, _: Response, next: NextFunction) => {
  if (!req.user) {
    throw new AccessDeniedError();
  }

  next();
};
