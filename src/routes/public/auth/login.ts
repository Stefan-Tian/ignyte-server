import { Router, Request, Response, NextFunction } from 'express';
import passport from 'passport';
import { LoginError } from '../../../errors/loginError';

const router = Router();

router.post(
  '/login',
  async (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate('local', (err: Error, user: any) => {
      if (err) {
        return next(err);
      }

      const loginNotAllowed = !user || !user.isVerified;
      if (loginNotAllowed) {
        throw new LoginError();
      }

      req.logIn(user, (err) => {
        if (err) return next(err);
        return res.status(200).send('Successfully logged in!');
      });
    })(req, res, next);
  }
);

export default router;
