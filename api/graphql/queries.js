const { GraphQLObjectType, } = require("graphql");
const userQueries            = require("./user/queries.js");

module.exports = new GraphQLObjectType({
  name: "Query",
  fields: () => (Object.assign({},
    userQueries
  ))
});
