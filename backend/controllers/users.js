const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const ValidationError = require("../errors/ValidationError");
const NotFoundError = require("../errors/NotFoundError");
const AuthError = require("../errors/AuthError");
const ConflictError = require("../errors/ConflictError");

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((user) => res.send({ data: user }))
    .catch(next);
};

module.exports.patchUser = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    {
      new: true,
    }
  )
    .orFail(() => {
      throw new NotFoundError("Данные не найдены");
    })
    .then((user) => res.send({ data: user }))
    .catch(() => {
      throw new ValidationError("Переданы некорректные данные.");
    })

    .catch(next);
};

module.exports.patchAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    {
      new: true,
    }
  )
    .orFail(() => {
      throw new NotFoundError("Данные не найдены");
    })
    .then((user) => res.send({ data: user }))

    .catch(() => {
      throw new ValidationError(
        "Переданы некорректные данные при обновлении аватара."
      );
    })

    .catch(next);
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        // это секретный ключ, в теории четко сказано, что он должен быть создан один и раз вручную
        "2061f1dbc12f53401a57d915f2e090cbca576b875e5e774d29cfc2462ce2d27d",
        { expiresIn: "7d" }
      );
      res
        .cookie("jwt", token, {
          maxAge: 3600000 * 24 * 7,
          httpOnly: true,
        })
        .status(200)
        .send(user)
        .end();
    })
    .catch((err) => {
      console.log(err);
      throw new AuthError("Ошибка авторизации 1");
    })

    .catch(next);
};

module.exports.createUser = (req, res, next) => {
  const { name, about, avatar, email, password } = req.body;

  bcrypt
    .hash(password, 10)
    .then((hash) =>
      User.create({
        name,
        about,
        avatar,
        password: hash,
        email,
      })
    )

    .then((user) => res.send({ data: user }))
    .catch((error) => {
      if (error.name === "MongoError" || error.code === 11000) {
        throw new ConflictError("Такой пользователь уже существует");
      }

      throw new ValidationError(error.message);
    })

    .catch(next);
};

module.exports.getUserById = (req, res, next) => {
  User.findById(req.params.id)
    .orFail()
    .then((user) => {
      res.send({ data: user });
    })
    // .catch((err) => serverError(err, res, "посланный айди невалидный"));
    .catch(() => {
      throw new NotFoundError("Данные не найдены");
    })
    .catch(next);
};

module.exports.getUser = (req, res, next) => {
  User.findById(req.user._id)
    .orFail()
    .then((user) => {
      res.send({ user });
    })
    .catch(() => {
      throw new NotFoundError("Данные не найдены");
    })
    .catch(next);
};
