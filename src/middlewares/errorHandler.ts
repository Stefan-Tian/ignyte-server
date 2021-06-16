import { Request, Response, NextFunction } from 'express';
import { CustomError } from '../errors/customError';

export const errorHandler = (
  err: Error,
  _: Request,
  res: Response,
  __: NextFunction
) => {
  if (err instanceof CustomError) {
    return res.status(err.statusCode).send({ errors: err.serializeErrors() });
  }

  res.status(500).send({
    errors: [{ message: err.message || 'Something went wrong' }],
  });
};
