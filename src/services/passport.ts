import passport from 'passport';
import { OAuth2Strategy as GoogleStrategy } from 'passport-google-oauth';
import { Strategy as LocalStrategy } from 'passport-local';
import argon2 from 'argon2';
import prisma from '../prisma/prisma';
import { User } from '@prisma/client';

passport.serializeUser<any, any>((user: User, done: any) => {
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
    'Incorrect Email or Password, or check your email for verification link!';

  if (!user) {
    done(undefined, false, { message: generalErrorMsg });
    return;
  }

  const valid = await argon2.verify(user.password!, password);
  if (!valid) {
    done(undefined, false, { message: generalErrorMsg });
  }

  done(undefined, user);
};

passport.use(new GoogleStrategy(googleOptions, oauthCallback));
passport.use(new LocalStrategy({ usernameField: 'email' }, localCallback));
