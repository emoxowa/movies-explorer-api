const REGEX = /https?:\/\/(w{3}.)?[\wА-Яа-я-]+\.[\wА-Яа-я-]{2,8}(\/?[\wА-Яа-я-]+)*/;
const DATABASE_URL_DEV = 'mongodb://localhost:27017/moviesdb';

const serverError = 'На сервере произошла ошибка';
const authRequired = 'Необходима авторизация';
const validationError = 'Ошибка валидации. Введены некорректные данные';
const userIdNotFound = 'Пользователь с указанным id не найден';
const emailExists = 'Пользователь с указанным email уже зарегистрирован';
const userLogout = 'Вы вышли из профиля';
const movieIdNotFound = 'Фильм с указанным _id не найден';
const movieDeleteForbidden = 'Запрещено удалять чужие фильмы';
const movieIdIncorrect = 'Некорректный id фильма';
const movieDeleted = 'Фильм удален';

module.exports = {
  REGEX,
  DATABASE_URL_DEV,
  serverError,
  authRequired,
  validationError,
  userIdNotFound,
  emailExists,
  userLogout,
  movieIdNotFound,
  movieDeleteForbidden,
  movieIdIncorrect,
  movieDeleted,
};
