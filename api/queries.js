const {
  GraphQLObjectType,
  GraphQLID,
  GraphQLNonNull,
  GraphQLList
} = require("graphql");
const {
  UserType
} = require("./types.js");
const controller = require("../controller/user.js");

const getUsers = {
  name:        "getUsers",
  description: "get users!",
  type:        new GraphQLList(UserType),
  resolve:     (root, args, context) => controller.getUsers(args, context)
};

const getCurrentUser = {
  name:        "getCurrentUser",
  description: "get current user!",
  type:        UserType,
  resolve:     (root, args, context) => controller.getCurrentUser(args, context)
};

module.exports = new GraphQLObjectType({
  name: "Query",
  fields: () => ({
    getUsers,
    getCurrentUser
  })
});
