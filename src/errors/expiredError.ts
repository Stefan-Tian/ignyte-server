import { CustomError } from './customError';

export class ExpiredError extends CustomError {
  statusCode = 410;

  constructor(message: string) {
    super(message);

    Object.setPrototypeOf(this, ExpiredError.prototype);
  }

  serializeErrors() {
    return [{ message: this.message }];
  }
}
