const router = require('express').Router();
const userRouter = require('./users');
const movieRouter = require('./movies');
const auth = require('../middlewares/auth');
const { login, createUser, logout } = require('../controllers/users');
const {
  validateLogin,
  validateUserCreate,
} = require('../middlewares/validate-user');
const NotFoundError = require('../utils/errors/not-found-err');

router.use('/users', auth, userRouter);
router.use('/movies', auth, movieRouter);
router.post('/signup', validateUserCreate, createUser);
router.post('/signin', validateLogin, login);
router.get('/signout', auth, logout);

router.use('*', auth, () => {
  throw new NotFoundError('Запрашиваемый ресурс не найден');
});

module.exports = router;
