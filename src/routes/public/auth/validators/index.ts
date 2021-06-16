import { body, query } from 'express-validator';

export const registerValidator = [
  body('nickname').isString().isLength({ min: 2, max: 50 }),
  body('email').isEmail().normalizeEmail(),
  body('password').isString().isLength({ min: 6 }),
];

export const verifyValidator = [query('token').isString()];

export const forgetPasswordValidator = [
  body('email').isEmail().normalizeEmail(),
];

export const resetPasswordValidator = [
  body('token').isString(),
  body('password').isString().isLength({ min: 6 }),
];
