const config = require("./server.js");

const name = {
  graphql: "graphql"
};

const url = {
  base: config.url,
  graphql: `${config.url}/${name.graphql}`
};

module.exports = {
  name,
  url
};
