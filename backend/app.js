const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const cors = require('cors');
const users = require('./routers/users');
const cards = require('./routers/cards');
const { createUser, login } = require('./controllers/users');
const { validateNewUser, validateLogin } = require('./middlewares/validation');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const { PORT = 3000 } = process.env;
const app = express();
const auth = require('./middlewares/auth');

const corsWhiteList = [
  'http://Timofei.Pustarnak.nomoredomains.icu',
  'https://Timofei.Pustarnak.nomoredomains.icu',
  'http://timofei.pustarnak.nomoredomains.icu',
  'https://timofei.pustarnak.nomoredomains.icu',
  'https://web.postman.co/workspace/My-Workspace~87c017d1-bc23-4aae-898f-83af2dcf3999/request/15292210-81b82941-9cf2-4703-8358-a1991679f558',
];

const corsOptions = {
  origin: (origin, callback) => {
    if (corsWhiteList.indexOf(origin) !== -1) {
      callback(null, true);
    }
  },
  credentials: true,
};

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(requestLogger);

app.use(cookieParser());
app.use(helmet());
app.use(cors(corsOptions));
app.post('/signin', validateLogin, login);
app.post('/signup', validateNewUser, createUser);

app.use(auth);
app.use('/', cards);
app.use('/', users);
app.use(errorLogger);
app.use(errors());

app.use((req, res) => {
  res.status(404).send({ error: 404, message: 'ресурс не найден' });
});

app.use((error, req, res, next) => {
  const { statusCode = 500, message } = error;

  res.status(statusCode).send({
    message: statusCode === 500 ? 'На сервере произошла ошибка.' : message,
  });

  next();
});

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

app.listen(PORT, () => {});
