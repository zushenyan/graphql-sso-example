const {
  GraphQLString,
  GraphQLID,
  GraphQLNonNull
}                        = require("graphql");
const UserType           = require("./types.js");
const controller         = require("../../../controller/user.js");
const cookieKeys         = require("../../../config/cookie-keys.js");
const facebookAuthVerify = require("../../../utils/facebook-auth/auth.js");
const googleAuthVerify   = require("../../../utils/google-auth/auth.js");

module.exports.signUp = {
  name:        "signUp",
  description: "sign up!",
  args:        {
    email:           { type: new GraphQLNonNull(GraphQLString) },
    password:        { type: new GraphQLNonNull(GraphQLString) },
    confirmPassword: { type: new GraphQLNonNull(GraphQLString) }
  },
  type:    UserType,
  resolve: async (root, args, context) => {
    const result = await controller.signUp(args);
    context.res.cookie(cookieKeys.token, result.token);
    return result;
  }
};

module.exports.signIn = {
  name:        "signIn",
  description: "sign in!",
  args:        {
    email:    { type: new GraphQLNonNull(GraphQLString) },
    password: { type: new GraphQLNonNull(GraphQLString) }
  },
  type:    UserType,
  resolve: async (root, args, context) => {
    const result = await controller.signIn(args);
    context.res.cookie(cookieKeys.token, result.token);
    return result;
  }
};

module.exports.signInWithFacebook = {
  name:        "signInWithFacebook",
  description: "sign in facebook!",
  args:        {
    userId:      { type: new GraphQLNonNull(GraphQLString) },
    accessToken: { type: new GraphQLNonNull(GraphQLString) }
  },
  type:    UserType,
  resolve: async (root, args, context) => {
    const { userId, accessToken } = args;
    const result = await controller.signInWithFacebook(
      () => facebookAuthVerify(userId, accessToken),
      "facebook_id"
    );
    context.res.cookie(cookieKeys.token, result.token);
    return result;
  }
};

module.exports.signInWithGoogle = {
  name:        "signInWithGoogle",
  description: "sign in google!",
  args:        {
    token: { type: new GraphQLNonNull(GraphQLString) },
  },
  type:    UserType,
  resolve: async (root, args, context) => {
    const { token } = args;
    const result = await controller.signInWithGoogle(
      () => googleAuthVerify(token),
      "google_id"
    );
    context.res.cookie(cookieKeys.token, result.token);
    return result;
  }
};

module.exports.signOut = {
  name:        "signOut",
  description: "sign out!",
  type:        GraphQLString,
  resolve:     async (root, args, context) => {
    const result = await controller.signOut(args);
    context.res.clearCookie(cookieKeys.token);
    return result.message;
  }
};
