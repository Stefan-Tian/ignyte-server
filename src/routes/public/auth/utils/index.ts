import argon2 from 'argon2';
import crypto from 'crypto';
import { ExpiredError } from '../../../../errors/expiredError';
import { NotFoundError } from '../../../../errors/notFoundError';
import prisma from '../../../../prisma/prisma';

export const generateToken = async (lastHours: number, userId: number) => {
  const randomToken = crypto.randomBytes(20).toString('hex');
  const currDate = new Date();
  const expireDate = new Date(
    currDate.setHours(currDate.getHours() + lastHours)
  );

  const verificationTokenData = await prisma.verificationToken.create({
    data: {
      token: randomToken,
      expire: expireDate,
      userId,
    },
  });

  return verificationTokenData;
};

export const validateToken = async (token: string) => {
  const existingToken = await prisma.verificationToken.findFirst({
    where: { token },
  });

  if (!existingToken) {
    throw new NotFoundError('The token does not exist');
  }

  if (existingToken.expire <= new Date()) {
    throw new ExpiredError(
      'The token has expired, use the login form to get a new one.'
    );
  }

  return existingToken;
};

export const hashPassword = async (password: string) => {
  return await argon2.hash(password);
};
