require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const routes = require('../routes');
const handleError = require('../middlewares/handle-error');
const { requestLogger, errorLogger } = require('../middlewares/logger');
const cors = require('../middlewares/cors');
const { DATABASE_URL_DEV } = require('../utils/constants');
const limiter = require('../middlewares/limiter');

const { PORT = 3003, NODE_ENV, DATABASE_URL_PROD } = process.env;

mongoose.connect(NODE_ENV === 'production' ? DATABASE_URL_PROD : DATABASE_URL_DEV)
  .then(() => {
    console.log('DB OK');
  })
  .catch((err) => {
    console.log('DB error', err);
  });

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(helmet());
app.use(requestLogger);
app.use(limiter);

app.get('/', (req, res) => {
  res.send('Welcome to the Movies Explorer API');
});

app.use(routes);
app.use(errorLogger);
app.use(errors());
app.use(handleError);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});

module.exports = app;
