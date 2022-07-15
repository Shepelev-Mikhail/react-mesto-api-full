const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const routerUser = require('./routes/users');
const routerCard = require('./routes/cards');
const routerAuthorized = require('./routes/authorized');
const routerRegister = require('./routes/register');
const auth = require('./middlewares/auth');
const NotFoundError = require('./errors/NotFoundError');
const defaultErrorHandler = require('./middlewares/defaultErrorHandler');

const options = {
  origin: [
    'http://localhost:3000',
    'http://localhost:3001',
    'https://shepelev.front.nomoredomains.xyz',
    'https://api.shepelev.front.nomoredomains.xyz',
    'http://shepelev.front.nomoredomains.xyz',
    'http://api.shepelev.front.nomoredomains.xyz',
    'https://Shepelev-Mikhail.github.io',
  ],
  credentials: true, // эта опция позволяет устанавливать куки
};

const { PORT = 3001 } = process.env;

const app = express();

app.use(helmet());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

app.use(limiter);

app.use('*', cors(options));

// прием данных
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(requestLogger);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

// подключение роутов
app.use('/', routerAuthorized);
app.use('/', routerRegister);
app.use('/', auth, routerUser);
app.use('/', auth, routerCard);

// роут на несуществующую страницу
app.use((req, res, next) => {
  next(new NotFoundError('Page not found'));
});

app.use(errorLogger);

// подключение монгоДБ
mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
});

// обработка ошибок
app.use(errors());
app.use(defaultErrorHandler);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
