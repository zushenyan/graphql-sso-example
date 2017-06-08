const {
  GraphQLObjectType,
  GraphQLUnionType,
  GraphQLID,
  GraphQLString,
} = require("graphql");

const UserType = new GraphQLObjectType({
  name:        "User",
  description: "user type!",
  fields:      () => ({
    id:      { type: GraphQLID },
    email:   { type: GraphQLString },
    message: { type: GraphQLString },
    token:   { type: GraphQLString },
  })
});

module.exports = {
  UserType
};
