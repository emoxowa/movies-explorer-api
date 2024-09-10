const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../utils/errors/unauth-err');
const { authRequired } = require('../utils/constants');

const { NODE_ENV, JWT_SECRET } = process.env;

const auth = (req, res, next) => {
  const { authorization } = req.cookies;

  if (!authorization) {
    return next(new UnauthorizedError(authRequired));
  }

  let payload;

  try {
    payload = jwt.verify(
      authorization,
      NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
    );
  } catch (err) {
    return next(new UnauthorizedError(authRequired));
  }

  req.user = payload;

  return next();
};

module.exports = auth;
