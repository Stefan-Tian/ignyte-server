declare namespace NodeJS {
  export interface ProcessEnv {
    NODE_ENV: 'development' | 'production' | 'test';
    DB_USER: string;
    DB_PASS: string;
    DB_HOST: string;
    DB_PORT: number;
    DB_NAME: string;
    GOOGLE_APP_ID: string;
    GOOGLE_APP_SECRET: string;
    SESSION_SECRET: string;
    JWT_SECRET: string;
    MAIL_API_KEY: string;
    MAIL_USER: string;
    MAIL_PASS: string;
  }
}

declare namespace Express {
  export interface User {
    id: number;
    email: string;
    nickname: string;
  }
}
