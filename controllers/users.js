const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/users');
const NotFoundError = require('../utils/errors/not-found-err');
const BadRequestError = require('../utils/errors/bad-request-err');
const ConflictError = require('../utils/errors/conflict-err');

const { NODE_ENV, JWT_SECRET } = process.env;

const getUser = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(new NotFoundError('Пользователь с указанным id не найден'))
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
        return next(
          new BadRequestError('Ошибка валидации. Введены некорректные данные'),
        );
      }
      if (err.code === 11000) {
        return next(
          new ConflictError(
            'Пользователь с указанным email уже зарегистрирован',
          ),
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
    .orFail(new NotFoundError('Пользователь с указанным id не найден'))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(
          new BadRequestError('Ошибка валидации. Введены некорректные данные'),
        );
      }
      if (err.code === 11000) {
        return next(
          new ConflictError(
            'Пользователь с указанным email уже зарегистрирован',
          ),
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
        sameSite: true,
      });
      res.send({ token });
    })
    .catch(next);
};

const logout = (req, res, next) => {
  try {
    res.clearCookie('authorization').send({ message: 'Выход' });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getUser,
  createUser,
  updateUser,
  login,
  logout,
};
