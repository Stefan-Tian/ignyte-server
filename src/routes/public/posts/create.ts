import { Router, Request, Response } from 'express';
import { isLoggedIn } from '../../../middlewares/isLoggedIn';
import prisma from '../../../prisma/prisma';

const router = Router();

router.post('/posts', isLoggedIn, async (req: Request, res: Response) => {
  const { title, content } = req.body;
  const currendUser = req.user!;
  const post = await prisma.post.create({
    data: {
      title,
      content,
      author: {
        connect: { id: currendUser.id },
      },
    },
  });

  res.status(201).send(post);
});

export default router;
