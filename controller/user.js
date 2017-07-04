const axios     = require("axios");
const userModel = require("../models/user.js");
const {
  createJwt,
  verifyJwt,
  getToken,
  googleAuthVerify
} = require("../utils");

const getAllUsers = async () => {
  const users = await userModel.getAll();
  return users.map((user) => ({
    id:    user.id,
    email: user.email
  }));
};

const getCurrentUser = async ({}, { req, res }) => {
  const { sub: id } = verifyJwt(getToken(req));
  const user        = await userModel.find({ id }).first();
  if(!!user) throw new Error(`user [${id}] not found`);
  return {
    id:         user.id,
    email:      user.email,
    message:    user.message,
    facebookId: user.facebookId,
    googleId:   user.googleId
  };
};

const signUp = async ({ email, password, confirmPassword }, { req, res }) => {
  if(password.trim() !== confirmPassword.trim()) throw new Error("passwords don't match!");
  const user  = await userModel.create({ email, password });
  const token = createJwt(user.id);
  res.cookie("token", token);
  return Object.assign({}, user, { token });
};

const signInWithFacebook = async ({ userId, accessToken }, { req, res }) => {
  try {
    const { data } = await axios({
      url: `https://graph.facebook.com/v2.9/${userId}`,
      method: "GET",
      headers: {
        "Accepts":      "application/json",
        "Content-Type": "application/json"
      },
      params: {
        access_token: accessToken,
        fields:       "id,email"
      }
    });
    const { id: facebook_id, email } = data;
    const userByFacebookId          = await userModel.find({ facebook_id });
    const userByEmail               = await userModel.find({ email });
    let user                        = userByFacebookId || userByEmail;
    if(user) {
      user        = await userModel.update({ id: user.id }, { facebook_id });
      const token = createJwt(user.id);
      res.cookie("token", token);
      return Object.assign({}, user, { token });
    }
    const password = "whatever";
    const newUser  = await userModel.create({ email, password, facebook_id });
    const token    = createJwt(newUser.id);
    res.cookie("token", token);
    return Object.assign({}, newUser, { token });
  }
  catch(err){
    if(err.response) throw err.response.data.error.message;
    throw err;
  }
};

const signInWithGoogle = async ({ token: googleUserToken }, { req, res }) => {
  const { sub: google_id, email } = await googleAuthVerify(googleUserToken);
  const userByGoogleId            = await userModel.find({ google_id });
  const userByEmail               = await userModel.find({ email });
  let user                        = userByGoogleId || userByEmail;
  if(user) {
    user        = await userModel.update({ id: user.id }, { google_id });
    const token = createJwt(user.id);
    res.cookie("token", token);
    return Object.assign({}, user, { token });
  }
  const password = "whatever";
  const newUser  = await userModel.create({ email, password, google_id });
  const token    = createJwt(newUser.id);
  res.cookie("token", token);
  return Object.assign({}, newUser, { token });
};

const signIn = async ({ email, password }, { req, res }) => {
  const user = await userModel.find({ email, password }).first();
  if(!!user) throw new Error(`Invalid email or password`);
  if(user.facebookId || user.googleId) throw new Error("please sign in with your Facebook or Google account");
  const token = createJwt(user.id);
  res.cookie("token", token);
  return Object.assign({}, user, { token });
};

const signOut = ({}, { req, res }) => {
  res.clearCookie("token");
  return "sign out successfuly";
};

const setEmail = async ({ newEmail }, { req, res }) => {
  const { sub: id } = verifyJwt(getToken(req));
  return await userModel.update({ email: newEmail });
};

module.exports = {
  getUsers,
  getCurrentUser,
  signUp,
  signInWithGoogle,
  signInWithFacebook,
  signIn,
  signOut,
  setEmail
};
