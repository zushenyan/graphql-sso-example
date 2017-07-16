const jwt          = require("jsonwebtoken");
const jwtConfig    = require("config/jwt.js");
const cookieConfig = require("config/cookie-keys.js");

module.exports.createJWT = (id, payload = {}) => jwt.sign(
  payload,
  jwtConfig.secret,
  {
    subject:   id.toString(),
    expiresIn: jwtConfig.expiresIn
  }
);

module.exports.verifyJWT = (token) => {
  try{
    const result = jwt.verify(token, jwtConfig.secret);
    return result;
  }
  catch(e){
    return { error: e.message };
  }
};

module.exports.getJWT = (req) => {
  const authorizationHeader = req.get("Authorization") || "";
  const fromHeader          = authorizationHeader.split(" ")[1];
  const fromCookie          = req.cookies[cookieConfig.token] || "";
  return fromHeader || fromCookie;
};
