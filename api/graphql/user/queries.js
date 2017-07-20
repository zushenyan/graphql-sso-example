const controller            = require("controller/user.js");
const { getJWT }            = require("utils/jwt.js");
const graphqlRequestHandler = require("utils/graphql-request-handler.js");
const {
  UserType,
  UserListType
}                           = require("./types.js");

module.exports.getAllUsers = {
  name:        "getAllUsers",
  description: "get all users!",
  type:        UserListType,
  resolve:     async (root, args, context) =>
    await graphqlRequestHandler(async () => {
      return await controller.getAllUsers(args);
    })
};

module.exports.getCurrentUser = {
  name:        "getCurrentUser",
  description: "get current user!",
  type:        UserType,
  resolve:     async (root, args, context) =>
    await graphqlRequestHandler(async () => {
      const { req } = context;
      const jwt = getJWT(req);
      return await controller.getCurrentUser({ jwt });
    })
};
