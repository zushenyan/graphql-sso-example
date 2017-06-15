const {
  GraphQLObjectType,
  GraphQLUnionType,
  GraphQLID,
  GraphQLString,
  GraphQLBoolean,
} = require("graphql");

const UserType = new GraphQLObjectType({
  name:        "User",
  description: "user type!",
  fields:      () => ({
    id:                 { type: GraphQLID },
    email:              { type: GraphQLString },
    message:            { type: GraphQLString },
    signInWithFacebook: { type: GraphQLBoolean },
    token:              { type: GraphQLString },
  })
});

module.exports = {
  UserType
};
