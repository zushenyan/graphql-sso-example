const {
  GraphQLObjectType,
  GraphQLUnionType,
  GraphQLID,
  GraphQLString,
  GraphQLBoolean,
} = require("graphql");

module.exports = new GraphQLObjectType({
  name:        "User",
  description: "user type!",
  fields:      () => ({
    id:          { type: GraphQLID },
    email:       { type: GraphQLString },
    token:       { type: GraphQLString },
    facebook_id: { type: GraphQLString },
    google_id:   { type: GraphQLString },
    created_at:  { type: GraphQLString },
    updated_at:  { type: GraphQLString },
  })
});
