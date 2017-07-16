const { GraphQLObjectType } = require("graphql");
const userMutations         = require("./user/mutations.js");

module.exports = new GraphQLObjectType({
  name: "Mutation",
  fields: () => (Object.assign({},
    userMutations
  ))
});
