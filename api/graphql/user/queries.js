const {
  GraphQLID,
  GraphQLNonNull,
  GraphQLList
}                           = require("graphql");
const UserType              = require("./types.js");
const controller            = require("controller/user.js");
const { getJWT }            = require("utils/jwt.js");
const graphqlRequestHandler = require("utils/graphql-request-handler.js");

module.exports.getAllUsers = {
  name:        "getAllUsers",
  description: "get all users!",
  type:        new GraphQLList(UserType),
  resolve:     (root, args, context) =>
    graphqlRequestHandler(async () => {
      return await controller.getAllUsers(args);
    })
};

module.exports.getCurrentUser = {
  name:        "getCurrentUser",
  description: "get current user!",
  type:        UserType,
  resolve:     (root, args, context) =>
    graphqlRequestHandler(async () => {
      const { req } = context;
      const jwt = getJWT(req);
      return await controller.getCurrentUser({ jwt });
    })
};
