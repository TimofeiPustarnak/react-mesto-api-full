const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const authorization = req.cookies.jwt;

  if (!authorization) {
    console.log(3);
    return res.status(401).send({ message: "Необходима авторизация 1" });
  }

  const token = authorization;
  let payload;

  try {
    payload = jwt.verify(
      token,
      "2061f1dbc12f53401a57d915f2e090cbca576b875e5e774d29cfc2462ce2d27d"
    );
  } catch (err) {
    console.log(1);
    return res.status(401).send({ message: "Необходима авторизация 2" });
  }

  req.user = payload;
  return next();
};
