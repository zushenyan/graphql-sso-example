const jwt          = require("jsonwebtoken");
const jwtConfig    = require("../config/jwt.js");
const cookieConfig = require("../config/cookie-keys.js");

module.exports.createJWT = (id, payload = {}) => jwt.sign(
  payload,
  jwtConfig.secret,
  {
    subject:   id,
    expiresIn: jwtConfig.expiresIn
  }
);

module.exports.verifyJWT = (token) => jwt.verify(token, jwtConfig.secret);

module.exports.getJWT = (req) => {
  const authorizationHeader = req.get("Authorization") || "";
  const fromHeader          = authorizationHeader.split(" ")[1];
  const fromCookie          = req.cookies[cookieConfig.token] || "";
  return fromHeader || fromCookie;
};
