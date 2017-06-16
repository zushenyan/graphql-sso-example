const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLID,
  GraphQLNonNull
} = require("graphql");
const {
  UserType
} = require("./types.js");
const models = require("../models/user.js");

const signUp = {
  name:        "signUp",
  description: "sign up!",
  args:        {
    email:           { type: new GraphQLNonNull(GraphQLString) },
    password:        { type: new GraphQLNonNull(GraphQLString) },
    confirmPassword: { type: new GraphQLNonNull(GraphQLString) }
  },
  type:    UserType,
  resolve: (root, args, context) => models.signUp(args, context)
};

const signIn = {
  name:        "signIn",
  description: "sign in!",
  args:        {
    email:    { type: new GraphQLNonNull(GraphQLString) },
    password: { type: new GraphQLNonNull(GraphQLString) }
  },
  type:    UserType,
  resolve: (root, args, context) => models.signIn(args, context)
};

const signInWithFacebook = {
  name:        "signInWithFacebook",
  description: "sign in facebook!",
  args:        {
    userId:      { type: new GraphQLNonNull(GraphQLString) },
    accessToken: { type: new GraphQLNonNull(GraphQLString) }
  },
  type:    UserType,
  resolve: (root, args, context) => models.signInWithFacebook(args, context)
};

const signInWithGoogle = {
  name:        "signInWithGoogle",
  description: "sign in google!",
  args:        {
    token: { type: new GraphQLNonNull(GraphQLString) },
  },
  type:    UserType,
  resolve: (root, args, context) => models.signInWithGoogle(args, context)
};

const signOut = {
  name:        "signOut",
  description: "sign out!",
  type:        GraphQLString,
  resolve:     (root, args, context) => models.signOut(context)
};

const setMessage = {
  name:        "setMessage",
  description: "set user message!",
  args:        {
    message: { type: new GraphQLNonNull(GraphQLString) }
  },
  type:    UserType,
  resolve: (root, args, context) => models.setMessage(args, context)
};

const setEmail = {
  name:        "setEmail",
  description: "set user email!",
  args:        {
    newEmail: { type: new GraphQLNonNull(GraphQLString) }
  },
  type:    UserType,
  resolve: (root, args, context) => models.setEmail(args, context)
};

module.exports = new GraphQLObjectType({
  name: "Mutation",
  fields: () => ({
    signUp,
    signIn,
    signInWithFacebook,
    signInWithGoogle,
    signOut,
    setMessage,
    setEmail
  })
});
