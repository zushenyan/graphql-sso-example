const GoogleAuth       = require("google-auth-library");
const googleAuthConfig = require("../../config/google-auth.js");
const {
  responseFormatter,
  errorFormatter
} = require("./formatter.js");

const auth   = new GoogleAuth();
const client = new auth.OAuth2(googleAuthConfig.clientId, "", "");

module.exports = (idToken) => new Promise((res, rej) => {
  client.verifyIdToken(
    idToken,
    googleAuthConfig.clientId,
    (err, login) => err ?
      rej(errorFormatter(err)) :
      res(responseFormatter(login))
  );
});
