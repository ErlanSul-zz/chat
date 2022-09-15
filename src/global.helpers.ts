import express from 'express';

export const getUserSession = (req: express.Request): Express.User => {
  if (
    req.session !== undefined &&
    req.session.passport !== undefined &&
    req.session.passport.user !== undefined
  ) {
    return req.session.passport.user;
  } else {
    return null;
  }
};
