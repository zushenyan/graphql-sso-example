const {
  GraphQLObjectType,
  GraphQLID,
  GraphQLNonNull,
  GraphQLList
} = require("graphql");
const {
  UserType
} = require("./types.js");
const models = require("../models/user.js");

const getUsers = {
  name: "getUsers",
  description: "get users!",
  type: new GraphQLList(UserType),
  resolve: (root, args) => models.getUsers(args)
};

const getUserInfo = {
  name:        "getUserInfo",
  description: "get user info!",
  args:        {
    id: { type: new GraphQLNonNull(GraphQLID) }
  },
  type:    UserType,
  resolve: (root, args) => models.getUserInfo(args)
};

module.exports = new GraphQLObjectType({
  name: "Query",
  fields: () => ({
    getUsers,
    getUserInfo
  })
});
