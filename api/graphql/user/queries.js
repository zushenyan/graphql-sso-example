const {
  GraphQLID,
  GraphQLNonNull,
  GraphQLList
} = require("graphql");
const UserType = require("./types.js");
const controller = require("controller/user.js");

module.exports.getAllUsers = {
  name:        "getAllUsers",
  description: "get all users!",
  type:        new GraphQLList(UserType),
  resolve:     (root, args, context) => controller.getAllUsers(args)
};

module.exports.getCurrentUser = {
  name:        "getCurrentUser",
  description: "get current user!",
  type:        UserType,
  resolve:     (root, args, context) => controller.getCurrentUser(args)
};
