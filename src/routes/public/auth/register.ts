import { Router, Request, Response } from 'express';

import { registerValidator } from './validators';
import { validateRequest } from '../../../middlewares/validateRequest';
import prisma from '../../../prisma/prisma';
import { hashPassword, sendVerificationEmail } from './utils';

const router = Router();

router.post(
  '/register',
  registerValidator,
  validateRequest,
  async (req: Request, res: Response) => {
    const { nickname, email, password } = req.body;
    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (!existingUser) {
      const hashedPassword = await hashPassword(password);
      const user = await prisma.user.create({
        data: {
          nickname,
          email,
          password: hashedPassword,
          isVerified: false,
          roles: {
            connect: [{ roleName: 'Learner' }],
          },
        },
      });

      const sentSuccessfully = await sendVerificationEmail(user.id, user.email);
      if (!sentSuccessfully) {
        throw new Error('Failed to send verification email.');
      }
    }

    // return successful anyways to prevent user enumeration
    res.status(201).send({
      message:
        'Successfully registered, Please check you email to verify your account.',
    });
  }
);

export default router;
