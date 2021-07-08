import loginRoute from './auth/login';
import logoutRoute from './auth/logout';
import registerRoute from './auth/register';
import verifyAccountRoute from './auth/verifyAccount';
import resetPasswordRoute from './auth/resetPassword';
import forgetPasswordRoute from './auth/forgetPassword';
import resendVerificationRoute from './auth/resendVerificationEmail';

// import createPostRoute from './posts/create';

import type { Express, Router } from 'express';

const setPublicRoutes = (app: Express) => {
  // auth
  const register = (route: Router) => app.use('/api', route);
  register(loginRoute);
  register(logoutRoute);
  register(registerRoute);
  register(verifyAccountRoute);
  register(resetPasswordRoute);
  register(forgetPasswordRoute);
  register(resendVerificationRoute);

  // post
  // register(createPostRoute);
};

export default setPublicRoutes;
