import { CustomError } from './customError';

export class LoginError extends CustomError {
  statusCode = 401;

  constructor() {
    super('Credentials Error');

    Object.setPrototypeOf(this, LoginError.prototype);
  }

  serializeErrors() {
    return [
      {
        message:
          'Incorrect Email or Password, or check your email for verification link!',
      },
    ];
  }
}
