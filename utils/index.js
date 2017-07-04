const jwt          = require("jsonwebtoken");
const GoogleAuth   = require("google-auth-library");
const authConfig   = require("../config/auth.json");
const googleConfig = require("../config/google-client.json");
const cookieKeys   = require("../constants/cookie-keys.js");

const auth   = new GoogleAuth;
const client = new auth.OAuth2(googleConfig.clientId, "", "");

const createJwt = (id, payload = {}) => jwt.sign(
  payload,
  authConfig.secret,
  {
    subject:   id,
    expiresIn: authConfig.expiresIn
  }
);

const verifyJwt = (token) => jwt.verify(token, authConfig.secret);

const getToken = (req) => {
  const authorizationHeader = req.get("Authorization") || "";
  const fromHeader          = authorizationHeader.split(" ")[1];
  const fromCookie          = req.cookies[cookieKeys.token] || "";
  return fromHeader || fromCookie;
};

const googleAuthVerify = (googleUserToken) => new Promise((res, rej) => {
  client.verifyIdToken(
    googleUserToken,
    googleConfig.clientId,
    (err, login) => err ? rej(err) : res(login.getPayload())
  );
});

module.exports = {
  createJwt,
  verifyJwt,
  getToken,
  googleAuthVerify
};
