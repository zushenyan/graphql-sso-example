const userModel = require("../models/user.js");
const {
  createJWT,
  verifyJWT
} = require("../utils/jwt.js");
const { googleAuthVerify }   = require("../utils/google-auth.js");
const { facebookAuthVerify } = require("../utils/facebook-auth.js");

const generatePublicUserInfo = (user) => ({
  id:          user.id,
  email:       user.email,
  facebook_id: user.facebook_id,
  google_id:   user.google_id,
  created_at:  user.created_at,
  updated_at:  user.updated_at
});

const getAllUsers = async () => {
  const users = await userModel.getAll();
  return users.map(generatePublicUserInfo);
};

const getCurrentUser = async ({ jwt }) => {
  const { sub: id } = verifyJWT(jwt);
  const user        = await userModel.find({ id }).first();
  if(!user) throw new Error(`user id ${id} not found`);
  return generatePublicUserInfo(user);
};

const updateUser = async ({ token, newData }) => {
  delete newData.id;
  delete newData.created_at;
  delete newData.updated_at;
  const { sub: id } = verifyJWT(token);
  const user = (await userModel.update({ id }, newData))[0];
  return generatePublicUserInfo(user);
};

const signUp = async ({ email, password, confirmPassword }) => {
  if(password.trim() !== confirmPassword.trim()) throw new Error("passwords don't match!");
  const user  = (await userModel.create({ email, password }))[0];
  // res.cookie("token", token);
  return Object.assign({}, generatePublicUserInfo(user), { token: createJWT(user.id) });
};

const signIn = async ({ email, password }) => {
  const user = (await userModel.find({ email, password }))[0];
  if(!user) throw new Error(`Invalid email or password`);
  // if(user.facebookId || user.googleId) throw new Error("please sign in with your Facebook or Google account");
  // res.cookie("token", token);
  return Object.assign({}, generatePublicUserInfo(user), { token: createJWT(user.id) });
};

const signInWithFacebook = async ({ userId, accessToken }) => {
  try {
    const { data }                   = facebookAuthVerify({ userId, accessToken });
    const { id: facebook_id, email } = data;
    const resultWithFacebookId       = (await userModel.find({ facebook_id }))[0];
    const resultWithEmail            = (await userModel.find({ email }))[0];
    let user                         = resultWithFacebookId || resultWithEmail;
    if(user) {
      user        = await userModel.update({ id: user.id }, { facebook_id });
      const token = createJWT(user.id);
      // res.cookie("token", token);
      return Object.assign({}, user, { token });
    }
    const password = "whatever";
    const newUser  = await userModel.create({ email, password, facebook_id });
    const token    = createJWT(newUser.id);
    // res.cookie("token", token);
    return Object.assign({}, newUser, { token });
  }
  catch(err){
    if(err.response) throw err.response.data.error.message;
    throw err;
  }
};

const signInWithGoogle = async ({ token: googleUserToken }, { req, res }) => {
  const { sub: google_id, email } = await googleAuthVerify(googleUserToken);
  const resultWithGoogleId        = (await userModel.find({ google_id }))[0];
  const resultWithEmail           = (await userModel.find({ email }))[0];
  let user                        = resultWithGoogleId || resultWithEmail;
  if(user) {
    user        = await userModel.update({ id: user.id }, { google_id });
    const token = createJWT(user.id);
    res.cookie("token", token);
    return Object.assign({}, user, { token });
  }
  const password = "whatever";
  const newUser  = await userModel.create({ email, password, google_id });
  const token    = createJWT(newUser.id);
  res.cookie("token", token);
  return Object.assign({}, newUser, { token });
};

const signOut = () => {
  // res.clearCookie("token");
  return {
    message: "sign out successfuly"
  };
};

module.exports = {
  generatePublicUserInfo,
  getAllUsers,
  getCurrentUser,
  updateUser,
  signUp,
  signInWithGoogle,
  signInWithFacebook,
  signIn,
  signOut
};
