const _     = require("lodash");
const axios = require("axios");
const {
  createJwt,
  verifyJwt,
  getToken,
  generateID
} = require("../utils");

const users = [];

const getUserById    = (id) => _.find(users, (user) => user.id === id);
const getUserByEmail = (email) => _.find(users, (user) => user.email === email);
const getUserByAuth  = (email, password) => _.find(users, (user) => user.email === email && user.password === password);

const createUser = ({email, password, confirmPassword, message = "this is a default message", signInWithFacebook = false}) => {
  if(email.length === 0) throw new Error(`email can't be empty`);
  if(getUserByEmail(email)) throw new Error(`email [${email}] has already been taken`);
  if(password !== confirmPassword) throw new Error(`passwords don't match`);
  if(password.length === 0 || confirmPassword.length === 0) throw new Error("");
  const user = {
    id: generateID(),
    email,
    password,
    message,
    signInWithFacebook
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
        id:                 user.id,
        email:              user.email,
        message:            user.message,
        signInWithFacebook: user.signInWithFacebook
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
    const { email } = data;
    const user = getUserByEmail(email);
    if(user) {
      const token = createJwt(user.id);
      res.cookie("token", token);
      return Object.assign({}, user, { token });
    }
    const password = "whatever";
    const newUser  = createUser({ email, password, confirmPassword: password, signInWithFacebook: true });
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

const signIn = ({ email, password }, { req, res }) => {
  const user = getUserByAuth(email, password);
  if(user) {
    if(user.signInWithFacebook) throw new Error("Use your facebook account to sign in!");
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

// prepare users data
users.push(createUser({ email: "foobar@test.com", password: "1234", confirmPassword: "1234" }));
users.push(createUser({ email: "ggyy@test.com", password: "4321", confirmPassword: "4321"}));

module.exports = {
  getUsers,
  getCurrentUser,
  signInWithFacebook,
  signUp,
  signIn,
  signOut,
  setMessage
};
