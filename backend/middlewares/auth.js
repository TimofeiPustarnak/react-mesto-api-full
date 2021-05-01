const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const authorization = req.cookies.jwt;
  return res.status(405).send(req.cookies.jwt);
  if (!authorization) {
    return res
      .status(401)
      .send({ message: "Необходима авторизация", coc: req.cookies.jwt });
  }

  const token = authorization;
  let payload;

  try {
    payload = jwt.verify(
      token,
      "2061f1dbc12f53401a57d915f2e090cbca576b875e5e774d29cfc2462ce2d27d"
    );
  } catch (err) {
    return res
      .status(401)
      .send({ message: "Необходима авторизация", coc: req.cookies.jwt });
  }

  req.user = payload;
  return next();
};
