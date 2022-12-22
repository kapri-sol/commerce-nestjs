import * as session from 'express-session';

export const sessionConfig: session.SessionOptions = {
  name: 'auth',
  secret: 'my-secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
  },
};
