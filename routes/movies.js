const movieRouter = require('express').Router();
const {
  validateMovie,
  validateMovieId,
} = require('../middlewares/validate-movie');

const {
  getMovies,
  createMovie,
  deleteMovie,
} = require('../controllers/movies');

movieRouter.get('/', getMovies);
movieRouter.post('/', validateMovie, createMovie);
movieRouter.delete('/:_id', validateMovieId, deleteMovie);

module.exports = movieRouter;
