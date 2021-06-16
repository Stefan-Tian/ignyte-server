import express from 'express';
import passport from 'passport';
import helmet from 'helmet';
import * as dotenv from 'dotenv';
import { Pool } from 'pg';
import pgConnect from 'connect-pg-simple';
import 'express-async-errors';
import bodyParser from 'body-parser';
import session from 'express-session';
import { errorHandler } from './middlewares/errorHandler';
import setPublicRoutes from './routes/public';
import setPrivateRoute from './routes/private';
import './services/passport';

dotenv.config();
const app = express();

const pgSession = pgConnect(session);
const sessionDBAccess = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
});

app.set('trust proxy', true);
app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  session({
    store: new pgSession({
      pool: sessionDBAccess,
      tableName: 'Session',
    }),
    secret: process.env.SESSION_SECRET || 'LFAJJFWO;JEO2J323',
    name: 'qid',
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 1000 * 60 * 60 * 24 * 365,
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

setPublicRoutes(app);
setPrivateRoute(app);

app.use(errorHandler);

app.listen(4000, () => {
  console.log('server running on port 4000');
});
