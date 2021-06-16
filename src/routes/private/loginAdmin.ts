import { Router, Request, Response, NextFunction } from 'express';
import passport from 'passport';
import { AccessDeniedError } from '../../errors/accessDeniedError';

import type { Role, User } from '@prisma/client';

interface UserWithRoles extends User {
  roles: Role[];
}

const router = Router();

router.post(
  '/admin/login',
  async (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate('local', (err: Error, user: UserWithRoles) => {
      const shouldDenyAccess =
        err ||
        !user ||
        !user.roles?.find(({ roleName }) => roleName === 'Scarlet Witch');

      if (shouldDenyAccess) {
        throw new AccessDeniedError();
      }

      req.logIn(user, (err) => {
        if (err) return res.send(err);
        res.send({ nickname: user.nickname });
      });
    })(req, res, next);
  }
);

export default router;
