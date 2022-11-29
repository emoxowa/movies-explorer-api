const REGEX = /https?:\/\/(w{3}.)?[\wА-Яа-я-]+\.[\wА-Яа-я-]{2,8}(\/?[\wА-Яа-я-]+)*/;
const DATABASE_URL_DEV = 'mongodb://localhost:27017/filmsdb';
module.exports = { REGEX, DATABASE_URL_DEV };
