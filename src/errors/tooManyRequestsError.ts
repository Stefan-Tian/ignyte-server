import { CustomError } from './customError';

export class TooManyRequestsError extends CustomError {
  statusCode = 429;

  constructor(message: string) {
    super(message);

    Object.setPrototypeOf(this, TooManyRequestsError.prototype);
  }

  serializeErrors() {
    return [{ message: this.message }];
  }
}
