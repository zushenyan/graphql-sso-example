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
  name:        "getUsers",
  description: "get users!",
  type:        new GraphQLList(UserType),
  resolve:     (root, args) => models.getUsers(args)
};

const getCurrentUser = {
  name:        "getCurrentUser",
  description: "get current user!",
  type:        UserType,
  resolve:     (root, args, context) => models.getCurrentUser(context)
};

module.exports = new GraphQLObjectType({
  name: "Query",
  fields: () => ({
    getUsers,
    getCurrentUser
  })
});
