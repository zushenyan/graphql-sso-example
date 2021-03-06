const axios = require("axios");
const {
  responseFormatter,
  errorFormatter
} = require("./formatter.js");

module.exports = (userId, accessToken) => new Promise((res, rej) => {
  axios({
    url: `https://graph.facebook.com/v2.9/${userId}`,
    method: "GET",
    headers: {
      "Accepts":      "application/json",
      "Content-Type": "application/json"
    },
    params: {
      access_token: accessToken,
      fields:       "id,email"
    }
  })
  .then((data) => res(responseFormatter(data.data)))
  .catch((err) => rej(errorFormatter(rer)));
});
