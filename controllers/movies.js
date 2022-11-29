const Movie = require('../models/movies');
const NotFoundError = require('../utils/errors/not-found-err');
const BadRequestError = require('../utils/errors/bad-request-err');
const ForbiddenError = require('../utils/errors/forbidden-err');

const getMovies = (req, res, next) => {
  Movie.find({ owner: req.user._id })
    .then((movies) => res.send(movies))
    .catch(next);
};

const createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
  } = req.body;
  const owner = req.user._id;
  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
    owner,
  })
    .then((newMovie) => res.send(newMovie))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(
          new BadRequestError('Ошибка валидации. Введены некорректные данные'),
        );
      }
      return next(err);
    });
};

const deleteMovie = (req, res, next) => {
  Movie.findById(req.params._id)
    .orFail(new NotFoundError('Фильм с указанным id не найден'))
    .then((movie) => {
      if (movie.owner.toString() !== req.user._id) {
        throw new ForbiddenError('Запрещено удалять чужие фильмы');
      }
      return Movie.findByIdAndRemove(movie);
    })
    .then(() => res.send({ message: 'Фильм удален' }))
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequestError('Некорректный id фильма'));
      }
      return next(err);
    });
};

module.exports = {
  getMovies,
  createMovie,
  deleteMovie,
};
