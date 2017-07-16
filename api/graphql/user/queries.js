const {
  GraphQLID,
  GraphQLNonNull,
  GraphQLList
} = require("graphql");
const UserType = require("./types.js");
const controller = require("controller/user.js");
const { getJWT } = require("utils/jwt.js");

module.exports.getAllUsers = {
  name:        "getAllUsers",
  description: "get all users!",
  type:        new GraphQLList(UserType),
  resolve:     async (root, args, context) => {
    try{
      return await controller.getAllUsers(args);
    }
    catch(e){
      console.error(e);
      return {
        status: 500,
        error: "internal server error"
      };
    }
  }
};

module.exports.getCurrentUser = {
  name:        "getCurrentUser",
  description: "get current user!",
  type:        UserType,
  resolve:     async (root, args, context) => {
    try{
      const { req } = context;
      const jwt = getJWT(req);
      return await controller.getCurrentUser({ jwt });
    }
    catch(e){
      console.error(e);
      return {
        status: 500,
        error: "internal server error"
      };
    }
  }
};
