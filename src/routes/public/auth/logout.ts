import { Request, Response, Router } from 'express';

const router = Router();

router.get('/logout', (req: Request, res: Response) => {
  req.logout();
  res.status(200).send({ message: 'Successfully logged out!' });
});

export default router;
