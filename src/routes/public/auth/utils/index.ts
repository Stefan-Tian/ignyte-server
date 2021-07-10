import argon2 from 'argon2';
import crypto from 'crypto';
import { ExpiredError } from '../../../../errors/expiredError';
import { NotFoundError } from '../../../../errors/notFoundError';
import prisma from '../../../../prisma/prisma';
import { sendEmail } from '../../../../services/email';

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

const sendEmailWithVerificationToken = async (
  endpoint: string,
  title: string,
  action: string,
  button: string,
  userId: number,
  userEmail: string,
  mailTitle: string
) => {
  const verificationTokenData = await generateToken(4, userId);
  const isSuccessful = await sendEmail(
    'public/verification.pug',
    {
      title,
      action,
      button,
      verificationLink: `http://dev.ignyte.life/${endpoint}?token=${verificationTokenData.token}`,
    },
    userEmail,
    mailTitle
  );

  return isSuccessful;
};

export const sendVerificationEmail = async (
  userId: number,
  userEmail: string
) => {
  return await sendEmailWithVerificationToken(
    'verify-account',
    'Verify your account',
    'verify your account',
    'verify',
    userId,
    userEmail,
    'Email verification'
  );
};

export const sendLoginFailedAlertEmail = async (
  userId: number,
  userEmail: string
) => {
  return await sendEmailWithVerificationToken(
    'reset-password',
    'Someone tried to login to your account with an incorrect password. If it was not you, reset the password as soon as possible.',
    'reset you password',
    'reset',
    userId,
    userEmail,
    'Account login notice'
  );
};

export const sendResetPasswordEmail = async (
  userId: number,
  userEmail: string
) => {
  return await sendEmailWithVerificationToken(
    'reset-password',
    'Reset you password',
    'reset you password',
    'reset',
    userId,
    userEmail,
    'Password Reset Link'
  );
};
