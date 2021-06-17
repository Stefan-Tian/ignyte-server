import { body } from 'express-validator';

export const createPostValidator = [
  body('title').isString().isLength({ min: 1, max: 200 }),
  body('content').isString().isLength({ min: 10 }),
];

export const updatePostValidator = createPostValidator.map((validator) =>
  validator.optional()
);
