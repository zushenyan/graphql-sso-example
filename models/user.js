const _     = require("lodash");
const axios = require("axios");
const GoogleAuth = require("google-auth-library");
const {
  createJwt,
  verifyJwt,
  getToken,
  generateID
} = require("../utils");

const GOOGLE_CLIENT_ID = "251705430658-ohq7k8m1qn0te2rbti8dm7dknjc5da73.apps.googleusercontent.com";

const auth   = new GoogleAuth;
const client = new auth.OAuth2(GOOGLE_CLIENT_ID, "", "");

const getUserById         = (id) => _.find(users, (user) => user.id === id);
const getUserByEmail      = (email) => _.find(users, (user) => user.email === email);
const getUserByAuth       = (email, password) => _.find(users, (user) => user.email === email && user.password === password);
const getUserByFacebookId = (id) => _.find(users, (user) => user.facebookId === id);
const getUserByGoogleId   = (id) => _.find(users, (user) => user.googleId === id);

const users = [];

const createUser = ({ email, password, confirmPassword, message = "this is a default message", facebookId, googleId}) => {
  if(email.length === 0) throw new Error(`email can't be empty`);
  if(getUserByEmail(email)) throw new Error(`email [${email}] has already been taken`);
  if(password !== confirmPassword) throw new Error(`passwords don't match`);
  if(password.length === 0 || confirmPassword.length === 0) throw new Error("");
  const user = {
    id: generateID(),
    email,
    password,
    message,
    facebookId,
    googleId
  };
  return user;
};

const getUsers = () => users;

const getCurrentUser = ({ req, res }) => {
  try{
    const { sub: id } = verifyJwt(getToken(req));
    const user        = getUserById(id);
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
  }
  catch(err){
    throw err;
  }
};

const signUp = ({ email, password, confirmPassword }, { req, res }) => {
  try {
    const user = createUser({email, password, confirmPassword});
    users.push(user);
    const token = createJwt(user.id);
    res.cookie("token", token);
    return Object.assign({}, user, { token });
  }
  catch(err){
    throw err;
  }
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
    const userById                  = getUserByFacebookId(facebookId);
    const userByEmail               = getUserByEmail(email);
    const user                      = userById || userByEmail;
    if(user) {
      const token = createJwt(user.id);
      res.cookie("token", token);
      return Object.assign({}, user, { token });
    }
    const password = "whatever";
    const newUser  = createUser({ email, password, confirmPassword: password, facebookId });
    users.push(newUser);
    const token = createJwt(newUser.id);
    res.cookie("token", token);
    return Object.assign({}, newUser, { token });
  }
  catch(err){
    if(err.response) throw err.response.data.error.message;
    throw err;
  }
};

const signInWithGoogle = async ({ token: googleUserToken }, { req, res }) => {
  try{
    const data = await new Promise((resolve, reject) => {
      client.verifyIdToken(googleUserToken, GOOGLE_CLIENT_ID, (err, login) => {
        if(err) reject(err);
        else resolve(login.getPayload());
      });
    });
    const { sub: googleId, email } = data;
    const userById                 = getUserByGoogleId(googleId);
    const userByEmail              = getUserByEmail(email);
    const user                     = userById || userByEmail;
    if(user) {
      if(!user.googleId) user.googleId = googleId;
      const token = createJwt(user.id);
      res.cookie("token", token);
      return Object.assign({}, user, { token });
    }
    const password = "whatever";
    const newUser  = createUser({ email, password, confirmPassword: password, googleId });
    users.push(newUser);
    const token = createJwt(newUser.id);
    res.cookie("token", token);
    return Object.assign({}, newUser, { token });
  }
  catch(err){
    throw err;
  }
};

const signIn = ({ email, password }, { req, res }) => {
  const user = getUserByAuth(email, password);
  if(user) {
    if(user.createdWithSSO) throw new Error("please sign in with your Facebook or Google account");
    const token = createJwt(user.id);
    res.cookie("token", token);
    return Object.assign({}, user, { token });
  }
  throw new Error(`Invalid email or password`);
};

const signOut = ({ req, res }) => {
  res.clearCookie("token");
  return "sign out successfuly";
};

const setMessage = ({ message }, { req, res }) => {
  try {
    const { sub: id } = verifyJwt(getToken(req));
    const user        = getUserById(id);
    user.message      = message;
    return user;
  }
  catch(err) {
    throw new Error(err.message);
  }
};

const setEmail = ({ newEmail }, { req, res }) => {
  try {
    const { sub: id } = verifyJwt(getToken(req));
    const user        = getUserById(id);
    user.email        = newEmail;
    return user;
  }
  catch(err) {
    throw err;
  }
};

// prepare users data
users.push(createUser({ email: "foobar@test.com", password: "1234", confirmPassword: "1234" }));
users.push(createUser({ email: "ggyy@test.com", password: "4321", confirmPassword: "4321"}));

module.exports = {
  getUsers,
  getCurrentUser,
  signInWithFacebook,
  signInWithGoogle,
  signUp,
  signIn,
  signOut,
  setMessage,
  setEmail
};
