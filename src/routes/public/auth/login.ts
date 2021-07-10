import { Router, Request, Response, NextFunction } from 'express';
import passport from 'passport';

const router = Router();

router.post(
  '/login',
  async (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate('local', (err: Error, user: any) => {
      if (err) {
        return res.status(401).send({ errors: [{ message: err }] });
      }

      req.login(user, (err) => {
        if (err) return next(err);
        return res.status(200).send({ message: 'Successfully logged in!' });
      });
    })(req, res, next);
  }
);

export default router;
