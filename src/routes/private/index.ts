import loginAdminRoute from './loginAdmin';

import type { Express } from 'express';

const setPrivateRoute = (app: Express) => {
  app.use(loginAdminRoute);
};

export default setPrivateRoute;
