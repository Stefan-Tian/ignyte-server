import { CustomError } from './customError';

export class AccessDeniedError extends CustomError {
  statusCode = 403;

  constructor() {
    super('Unauthorized request');

    Object.setPrototypeOf(this, AccessDeniedError.prototype);
  }

  serializeErrors() {
    return [
      {
        message: 'Access Denied!',
      },
    ];
  }
}
