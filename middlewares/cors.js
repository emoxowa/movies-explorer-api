const allowedCors = [
  'https://localhost:3000',
  'http://localhost:3000',
  'http://localhost',
  'https://localhost',
  'https://movies-explorer.yandex.nomoredomains.club',
  'https://movies-explorer-api-seven.vercel.app',
  'https://movies-explorer-frontend-six-ebon.vercel.app',
  'https://api.nomoreparties.co/beatfilm-movies',
];

const cors = (req, res, next) => {
  const { origin } = req.headers;
  const { method } = req;
  const DEFAULT_ALLOWED_METHODS = 'GET,HEAD,PUT,PATCH,POST,DELETE';
  const requestHeaders = req.headers['access-control-request-headers'];

  if (allowedCors.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Credentials', true);
  }

  if (method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', DEFAULT_ALLOWED_METHODS);
    if (requestHeaders) {
      res.header('Access-Control-Allow-Headers', requestHeaders);
    }
    return res.end();
  }

  return next();
};

module.exports = cors;
