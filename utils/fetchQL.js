const axios = require("axios");

module.exports = (url, query, variables) => axios({
  url,
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    // "Credentials": "include"
  },
  data: JSON.stringify({ query, variables })
})
.then((response) => response.data.data)
.catch((response) => response.response.data);
