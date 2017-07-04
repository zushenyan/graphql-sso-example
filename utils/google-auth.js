const GoogleAuth       = require("google-auth-library");
const googleAuthConfig = require("../config/google-auth.js");

const auth   = new GoogleAuth;
const client = new auth.OAuth2(googleAuthConfig.clientId, "", "");

module.exports.googleAuthVerify = (googleUserToken) => new Promise((res, rej) => {
  client.verifyIdToken(
    googleUserToken,
    googleAuthConfig.clientId,
    (err, login) => err ? rej(err) : res(login.getPayload())
  );
});
