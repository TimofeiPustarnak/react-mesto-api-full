const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const { errors } = require("celebrate");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const cors = require("cors");
const users = require("./routers/users");
const cards = require("./routers/cards");
const { createUser, login } = require("./controllers/users");
const { validateNewUser, validateLogin } = require("./middlewares/validation");
const { requestLogger, errorLogger } = require("./middlewares/logger");

const { PORT = 3000 } = process.env;
const app = express();

const auth = require("./middlewares/auth");

// const corsWhiteList = [
//   "http://Timofei.Pustarnak.nomoredomains.icu",
//   "https://Timofei.Pustarnak.nomoredomains.icu",
//   "http://timofei.pustarnak.nomoredomains.icu",
//   "https://timofei.pustarnak.nomoredomains.icu",
// ];

// const corsOptions = {
//   origin: (origin, callback) => {
//     if (corsWhiteList.indexOf(origin) !== -1) {
//       callback(null, true);
//     }
//   },
//   credentials: true,
// };
const options = {
  origin: [
    "http://Timofei.Pustarnak.nomoredomains.icu",
    "https://Timofei.Pustarnak.nomoredomains.icu",
    "http://timofei.pustarnak.nomoredomains.icu",
    "https://timofei.pustarnak.nomoredomains.icu",
    "https://web.postman.co",
  ],
  methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE", "OPTIONS"],
  preflightContinue: false,
  optionsSuccessStatus: 204,
  allowedHeaders: [
    "Content-Type",
    "Origin",
    "Authorization",
    "X-Requested-With",
    "Accept",
  ],
  credentials: true,
};

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(requestLogger);

app.use(cookieParser());
app.use(helmet());

app.use("/", function (req, res) {
  res
    .cookie("jwt", "SOME TEST TEXT 123", {
      httpOnly: true,
      sameSite: "none",
      secure: true,
      maxAge: 604800000,
    })
    .status(200)
    .send({ data: "cookieTest" });
});

app.use("*", cors(options));
//app.use(cors(corsOptions));
app.post("/signin", validateLogin, login);
app.post("/signup", validateNewUser, createUser);

// app.use(auth);
app.use("/", auth, cards);
app.use("/", auth, users);
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
