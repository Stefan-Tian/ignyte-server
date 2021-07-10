import passport from 'passport';
import {
  sendVerificationEmail,
  sendLoginFailedAlertEmail,
} from '../routes/public/auth/utils';
import { Strategy as LocalStrategy } from 'passport-local';
import argon2 from 'argon2';
import prisma from '../prisma/prisma';
import { sendEmail } from './email';

passport.serializeUser<any, any>((user: any, done: any) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: number, done) => {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) throw new Error('User Not Found');
  done(null, user);
});

const googleOptions = {
  clientID: process.env.GOOGLE_APP_ID || '',
  clientSecret: process.env.GOOGLE_APP_SECRET || '',
  callbackURL: '/auth/google/callback',
};

const oauthCallback = async (
  _: string,
  __: string,
  profile: any,
  done: any
) => {
  const { id, email, name } = profile;
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });
  if (existingUser) {
    done(null, existingUser);
    return;
  }

  const user = await prisma.user.create({
    data: {
      thirdPartyId: id,
      email,
      nickname: name,
      isVerified: true,
    },
  });

  done(null, user);
};

const localCallback = async (email: string, password: string, done: any) => {
  const user = await prisma.user.findUnique({
    where: { email },
    include: { roles: true },
  });

  const generalErrorMsg =
  if (!user || !user.isVerified) {
    if (user && !user.isVerified) {
      await sendVerificationEmail(user.id, user.email);
    } else {
      await sendEmail(
        'public/verification.pug',
        {
          title: 'Someone tried to login to a user that does not exist',
          action: 'monitor the service',
          button: 'check',
          verificationLink: `dev.ignyte.life`,
        },
        'stefantien@ignyte.life',
        'Non-existent user login attempt'
      );
    }

  if (!user) {
    done(undefined, false, { message: generalErrorMsg });
    return;
  }

  const valid = await argon2.verify(user.password!, password);
  if (!valid) {
    await sendLoginFailedAlertEmail(user.id, user.email);
  }

  done(undefined, user);
};

passport.use(new GoogleStrategy(googleOptions, oauthCallback));
passport.use(new LocalStrategy({ usernameField: 'email' }, localCallback));
