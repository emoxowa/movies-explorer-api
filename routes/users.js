const userRouter = require('express').Router();
const {
  validateUserUpdate,
} = require('../middlewares/validate-user');

const {
  getUser,
  updateUser,
} = require('../controllers/users');

userRouter.get('/me', getUser);
userRouter.patch('/me', validateUserUpdate, updateUser);

module.exports = userRouter;
