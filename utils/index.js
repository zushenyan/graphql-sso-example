const jwt          = require("jsonwebtoken");
const uuid         = require("uuid/v4");
const GoogleAuth   = require("google-auth-library");
const authConfig   = require("../config/auth.json");
const googleConfig = require("../config/google-client.json");

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
  const fromCookie          = req.cookies["token"] || "";
  const token               = fromHeader || fromCookie;
  return token;
};

const generateID = () => uuid().substr(0, 6);

const googleAuthVerify = (googleUserToken) => new Promise((res, rej) => {
  client.verifyIdToken(googleUserToken, googleConfig.clientId, (err, login) => {
    if(err) rej(err);
    else res(login.getPayload());
  });
});

module.exports = {
  createJwt,
  verifyJwt,
  getToken,
  generateID,
  googleAuthVerify
};
