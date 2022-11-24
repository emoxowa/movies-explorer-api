require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const limiter = require('express-rate-limit');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
// const routes = require('./routes/index');
// const handleError = require('./middlewares/handle-error');
// const { requestLogger, errorLogger } = require('./middlewares/logger');
// const cors = require('./middlewares/cors');

const { PORT = 3001 } = process.env;

mongoose
  .connect('mongodb://localhost:27017/bitfilmsdb', {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log('DB OK');
  })
  .catch((err) => {
    console.log('DB error', err);
  });

const app = express();
// app.use(cors);
app.use(
  limiter({
    windowMs: 10 * 60 * 1000,
    max: 100,
  }),
);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(helmet());
// app.use(requestLogger);
// app.use(routes);
// app.use(errorLogger);
app.use(errors());
// app.use(handleError);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
