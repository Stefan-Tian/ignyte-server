import { Router, Request, Response } from 'express';
import { validateRequest } from '../../../middlewares/validateRequest';
import { verifyValidator } from './validators';
import prisma from '../../../prisma/prisma';
import { validateToken } from './utils';

const router = Router();

router.get(
  '/verify',
  verifyValidator,
  validateRequest,
  async (req: Request, res: Response) => {
    const tokenToValidate = req.query.token as string;
    const existingToken = await validateToken(tokenToValidate);

    await prisma.user.update({
      data: { isVerified: true },
      where: { id: existingToken.userId },
    });

    res
      .status(200)
      .send({ message: "You've verified your account, You can login now!" });
  }
);

export default router;
