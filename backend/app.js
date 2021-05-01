const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const { errors } = require("celebrate");
const cookieParser = require("cookie-parser");
const cors = require("middlewares/cors.js");
const helmet = require("helmet");
const users = require("./routers/users");
const cards = require("./routers/cards");
const { createUser, login } = require("./controllers/users");
const { validateNewUser, validateLogin } = require("./middlewares/validation");
const { requestLogger, errorLogger } = require("./middlewares/logger");

const { PORT = 3000 } = process.env;
const app = express();
const auth = require("./middlewares/auth");

const corsOptions = {
  origin: [
    "https://Timofei.Pustarnak.nomoredomains.icu",
    "http://Timofei.Pustarnak.nomoredomains.icu",
  ],
  credentials: true,
};
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(requestLogger);

app.use(cookieParser());
app.use(helmet());

app.post("/signin", validateLogin, login);
app.post("/signup", validateNewUser, createUser);

app.use(auth);
app.use("/", cards);
app.use("/", users);
app.use(errorLogger);
app.use(errors());

app.use((req, res) => {
  res.status(404).send({ error: 404, message: "ресурс не найден" });
});

app.use((error, req, res, next) => {
  const { statusCode = 500, message } = error;

  res.status(statusCode).send({
    message: statusCode === 500 ? "На сервере произошла ошибка." : message,
  });

  next();
});

mongoose.connect("mongodb://localhost:27017/mestodb", {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

app.listen(PORT, () => {});
