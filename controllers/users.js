const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/users');
const NotFoundError = require('../utils/errors/not-found-err');
const BadRequestError = require('../utils/errors/bad-request-err');
const ConflictError = require('../utils/errors/conflict-err');
const {
  validationError,
  userIdNotFound,
  emailExists,
  userLogout,
} = require('../utils/constants');

const { NODE_ENV, JWT_SECRET } = process.env;

const getUser = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(new NotFoundError(userIdNotFound))
    .then((user) => {
      res.send(user);
    })
    .catch(next);
};

const createUser = (req, res, next) => {
  const {
    name, email, password,
  } = req.body;
  bcrypt
    .hash(password, 10)
    .then((hash) => User.create({
      name,
      email,
      password: hash,
    }))
    .then((newUser) => {
      const objUser = newUser.toObject();
      delete objUser.password;
      return res.status(201).send(objUser);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestError(validationError));
      }
      if (err.code === 11000) {
        return next(
          new ConflictError(emailExists),
        );
      }
      return next(err);
    });
};

const updateUser = (req, res, next) => {
  const userId = req.user._id;
  const { name, email } = req.body;
  User.findByIdAndUpdate(
    userId,
    { name, email },
    {
      new: true,
      runValidators: true,
    },
  )
    .orFail(new NotFoundError(userIdNotFound))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestError(validationError));
      }
      if (err.code === 11000) {
        return next(
          new ConflictError(emailExists),
        );
      }
      return next(err);
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
        { expiresIn: '7d' },
      );
      res.cookie('authorization', token, {
        httpOnly: true,
        maxAge: 3600000 * 24 * 7,
      });
      res.send({ token });
    })
    .catch(next);
};

const logout = (req, res) => {
  res.clearCookie('authorization').send({ message: userLogout });
};

module.exports = {
  getUser,
  createUser,
  updateUser,
  login,
  logout,
};
