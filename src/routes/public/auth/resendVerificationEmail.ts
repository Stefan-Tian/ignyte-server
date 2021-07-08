import { Router, Request, Response } from 'express';
import dayjs from 'dayjs';

import { resendEmailValidator } from './validators';
import { validateRequest } from '../../../middlewares/validateRequest';
import prisma from '../../../prisma/prisma';
import { sendVerificationEmail } from './utils';

const router = Router();

router.post(
  '/resend-verification-email',
  resendEmailValidator,
  validateRequest,
  async (req: Request, res: Response) => {
    const { email } = req.body;
    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser && !existingUser.isVerified) {
      const mostRecentToken = await prisma.verificationToken.findFirst({
        where: {
          userId: existingUser.id,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      let canResend = false;
      if (mostRecentToken) {
        const now = dayjs();
        const lastResendTime = dayjs(mostRecentToken.createdAt);
        const duration = now.diff(lastResendTime, 'minutes');
        if (duration > 2) {
          canResend = true;
        }
      }

      if (canResend) {
        const sentSuccessfully = await sendVerificationEmail(
          existingUser.id,
          existingUser.email
        );

        if (!sentSuccessfully) {
          throw new Error('Failed to send verification email.');
        }
      }
    }

    res.status(201).send({
      message:
        'Successfully resent, Please check you email again to verify your account.',
    });
  }
);

export default router;
