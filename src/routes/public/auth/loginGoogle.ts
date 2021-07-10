import { Router, Request, Response, NextFunction } from 'express';
import passport from 'passport';

const router = Router();

router.get(
  '/auth/google',
  (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate('google', { scope: ['profile', 'email'] })(
      req,
      res,
      next
    );
  }
);

router.get(
  '/auth/google/callback',
  (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate('google', {
      successRedirect: '/',
      failureRedirect: '/auth',
    })(req, res, next);
  }
);

export default router;
