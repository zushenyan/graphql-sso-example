const GoogleAuth       = require("google-auth-library");
const googleAuthConfig = require("../config/google-auth.js");

const auth   = new GoogleAuth();
const client = new auth.OAuth2(googleAuthConfig.clientId, "", "");

module.exports.googleAuthVerify = (idToken) => new Promise((res, rej) => {
  client.verifyIdToken(
    idToken,
    googleAuthConfig.clientId,
    (err, login) => err ? rej(err) : res(login.getPayload())
  );
});
