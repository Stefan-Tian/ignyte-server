import loginRoute from './auth/login';
import logoutRouter from './auth/logout';
import registerRoute from './auth/register';
import verifyAccountRoute from './auth/verifyAccount';
import resetPasswordRoute from './auth/resetPassword';
import forgetPasswordRoute from './auth/forgetPassword';

import type { Express } from 'express';

const setPublicRoutes = (app: Express) => {
  // auth
  app.use(loginRoute);
  app.use(logoutRouter);
  app.use(registerRoute);
  app.use(verifyAccountRoute);
  app.use(resetPasswordRoute);
  app.use(forgetPasswordRoute);
};

export default setPublicRoutes;
