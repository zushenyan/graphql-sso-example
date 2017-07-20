const {
  GraphQLObjectType,
  GraphQLInterfaceType,
  GraphQLString
} = require("graphql");

const fields = {
  message: { type: GraphQLString },
  status:  { type: GraphQLString },
};

const ResponseType = new GraphQLObjectType({
  name:        "Response",
  description: "response type!",
  fields:      () => fields
});

module.exports = {
  ResponseType,
  fields
};
