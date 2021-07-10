import { Router, Request, Response } from 'express';

import { validateRequest } from '../../../middlewares/validateRequest';
import prisma from '../../../prisma/prisma';
import { forgetPasswordValidator } from './validators';
import { sendResetPasswordEmail } from './utils';

const router = Router();

router.post(
  '/forget-password',
  forgetPasswordValidator,
  validateRequest,
  async (req: Request, res: Response) => {
    const { email } = req.body;
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (user) {
      const sentSuccessfully = await sendResetPasswordEmail(
        user.id,
        user.email
      );

      if (!sentSuccessfully) {
        throw new Error('Failed to send a password reset link.');
      }
    }

    // return successful anyways to prevent user enumeration
    res.status(201).send({
      message: 'A password reset link has been sent to your email.',
    });
  }
);

export default router;
