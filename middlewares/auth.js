const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../utils/errors/unauth-err');
const { authRequired } = require('../utils/constants');

const { NODE_ENV, JWT_SECRET } = process.env;

const auth = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    throw new UnauthorizedError(authRequired);
  }
  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(
      token,
      NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
    );
  } catch (err) {
    throw new UnauthorizedError(authRequired);
  }

  req.user = payload;

  return next();
};

module.exports = auth;
