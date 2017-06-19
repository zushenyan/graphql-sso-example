const axios      = require("axios");
const userModel  = require("../models/user.js");
const {
  createJwt,
  verifyJwt,
  getToken,
  googleAuthVerify
} = require("../utils");

// prepare users data
userModel.createUser({ email: "foobar@test.com", password: "1234", confirmPassword: "1234" });
userModel.createUser({ email: "ggyy@test.com", password: "4321", confirmPassword: "4321" });

const getUsers = () => userModel.getAllUsers();

const getCurrentUser = ({}, { req, res }) => {
  const { sub: id } = verifyJwt(getToken(req));
  const user        = userModel.getUserById(id);
  if(user) {
    return {
      id:         user.id,
      email:      user.email,
      message:    user.message,
      facebookId: user.facebookId,
      googleId:   user.googleId
    };
  }
  throw new Error(`user [${id}] not found`);
};

const signUp = ({ email, password, confirmPassword }, { req, res }) => {
  const user = userModel.createUser({email, password, confirmPassword});
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
    const { id: facebookId, email } = data;
    const userByFacebookId          = userModel.getUserByFacebookId(facebookId);
    const userByEmail               = userModel.getUserByEmail(email);
    let user                        = userByFacebookId || userByEmail;
    if(user) {
      user        = userModel.updateUser({ id: user.id, data: { facebookId }});
      const token = createJwt(user.id);
      res.cookie("token", token);
      return Object.assign({}, user, { token });
    }
    const password = "whatever";
    const newUser  = userModel.createUser({ email, password, confirmPassword: password, facebookId });
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
  const { sub: googleId, email } = await googleAuthVerify(googleUserToken);
  const userByGoogleId           = userModel.getUserByGoogleId(googleId);
  const userByEmail              = userModel.getUserByEmail(email);
  let user                       = userByGoogleId || userByEmail;
  if(user) {
    user        = userModel.updateUser({ id: user.id, data: { googleId }});
    const token = createJwt(user.id);
    res.cookie("token", token);
    return Object.assign({}, user, { token });
  }
  const password = "whatever";
  const newUser  = userModel.createUser({ email, password, confirmPassword: password, googleId });
  const token    = createJwt(newUser.id);
  res.cookie("token", token);
  return Object.assign({}, newUser, { token });
};

const signIn = ({ email, password }, { req, res }) => {
  const user = userModel.getUserByAuth(email, password);
  if(user) {
    if(user.facebookId || user.gooleId) throw new Error("please sign in with your Facebook or Google account");
    const token = createJwt(user.id);
    res.cookie("token", token);
    return Object.assign({}, user, { token });
  }
  throw new Error(`Invalid email or password`);
};

const signOut = ({}, { req, res }) => {
  res.clearCookie("token");
  return "sign out successfuly";
};

const setMessage = ({ message }, { req, res }) => {
  try {
    const { sub: id } = verifyJwt(getToken(req));
    return userModel.updateUser({ id, data: { message }});
  }
  catch(err) {
    throw new Error(err.message);
  }
};

const setEmail = ({ newEmail }, { req, res }) => {
  const { sub: id } = verifyJwt(getToken(req));
  const emailTaken  = userModel.getUserByEmail(newEmail);
  if(emailTaken) throw new Error(`${newEmail} has already been taken.`);
  return userModel.updateUser({ id, data: { email: newEmail }});
};

module.exports = {
  getUsers,
  getCurrentUser,
  signUp,
  signInWithGoogle,
  signInWithFacebook,
  signIn,
  signOut,
  setMessage,
  setEmail
};
