import { Router, Request, Response } from 'express';
import { validateRequest } from '../../../middlewares/validateRequest';
import prisma from '../../../prisma/prisma';
import { hashPassword, validateToken } from './utils';
import { resetPasswordValidator } from './validators';

const router = Router();

router.post(
  '/reset-password',
  resetPasswordValidator,
  validateRequest,
  async (req: Request, res: Response) => {
    const { token, password } = req.body;

    const existingToken = await validateToken(token);
    const hashedPassword = await hashPassword(password);

    await prisma.user.update({
      where: {
        id: existingToken.userId,
      },
      data: {
        password: hashedPassword,
      },
    });

    prisma.verificationToken.delete({
      where: {
        token,
      },
    });

    res.status(200).send({
      message:
        'Successfully updated the password, please use your new password to login again.',
    });
  }
);

export default router;
