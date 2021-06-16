import { Router, Request, Response } from 'express';

import { registerValidator } from './validators';
import { validateRequest } from '../../../middlewares/validateRequest';
import prisma from '../../../prisma/prisma';
import { sendEmail } from '../../../services/email';
import { generateToken, hashPassword } from './utils';

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

      const verificationTokenData = await generateToken(4, user.id);
      const sentSuccessfully = await sendEmail(
        'public/verification.pug',
        {
          title: 'Verify your account',
          action: 'verify your account',
          button: 'verify',
          verificationLink: `http://localhost:4000/verify?token=${verificationTokenData.token}`,
        },
        user.email,
        'Email Verification'
      );

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
