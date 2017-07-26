const { fields: ResponseFields } = require("api/graphql/response/types.js");
const {
  GraphQLObjectType,
  GraphQLInputObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLList
} = require("graphql");

const fields = {
  id:          { type: GraphQLID },
  email:       { type: GraphQLString },
  token:       { type: GraphQLString },
  about:       { type: GraphQLString },
  facebook_id: { type: GraphQLString },
  google_id:   { type: GraphQLString },
  created_at:  { type: GraphQLString },
  updated_at:  { type: GraphQLString },
};

const inputFields = {
  email:    { type: GraphQLString },
  password: { type: GraphQLString },
  about:    { type: GraphQLString },
};

const UserTypeHelper = new GraphQLObjectType({
  name:        "UserHelper",
  description: "user type helper!",
  fields:      () => fields
});

const UserType = new GraphQLObjectType({
  name:        "User",
  description: "user type!",
  fields:      () => Object.assign({}, fields, ResponseFields)
});

const UserListType = new GraphQLObjectType({
  name:        "UserList",
  description: "user list type!",
  fields:      () => Object.assign({},
    {
      users: { type: new GraphQLList(UserTypeHelper) }
    },
    ResponseFields
  )
});

const UserInputType = new GraphQLInputObjectType({
  name:        "UserInput",
  description: "user input type!",
  fields:      inputFields
});

module.exports = {
  UserTypeHelper,
  fields,
  UserType,
  UserListType,
  UserInputType
};
