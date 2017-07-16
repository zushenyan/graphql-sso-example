const { GraphQLSchema } = require("graphql");
const query             = require("./queries.js");
const mutation          = require("./mutations.js");

module.exports = new GraphQLSchema({
  query,
  mutation
});
