const Movie = require('../models/movies');
const NotFoundError = require('../utils/errors/not-found-err');
const BadRequestError = require('../utils/errors/bad-request-err');
const ForbiddenError = require('../utils/errors/forbidden-err');
const {
  validationError,
  movieIdNotFound,
  movieDeleteForbidden,
  movieIdIncorrect,
  movieDeleted,
} = require('../utils/constants');

const getMovies = (req, res, next) => {
  Movie.find({ owner: req.user._id })
    .then((movies) => res.send(movies))
    .catch(next);
};

const createMovie = (req, res, next) => {
  Movie.create({
    ...req.body,
    owner: req.user._id,
  })
    .then((newMovie) => res.send(newMovie))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestError(validationError));
      }
      return next(err);
    });
};

const deleteMovie = (req, res, next) => {
  Movie.findById(req.params._id)
    .orFail(new NotFoundError(movieIdNotFound))
    .then((movie) => {
      if (movie.owner.toString() !== req.user._id) {
        throw new ForbiddenError(movieDeleteForbidden);
      }
      return Movie.findByIdAndRemove(movie);
    })
    .then(() => res.send({ message: movieDeleted }))
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequestError(movieIdIncorrect));
      }
      return next(err);
    });
};

module.exports = {
  getMovies,
  createMovie,
  deleteMovie,
};
