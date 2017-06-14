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

const createUser = (email, password, confirmPassword, message = "this is a default message") => {
  if(email.length === 0) throw new Error(`email can't be empty`);
  if(getUserByEmail(email)) throw new Error(`email [${email}] has already been taken`);
  if(password !== confirmPassword) throw new Error(`passwords don't match`);
  if(password.length === 0 || confirmPassword.length === 0) throw new Error("");
  const user = {
    id: generateID(),
    email,
    password,
    message
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
        id:      user.id,
        email:   user.email,
        message: user.message
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
    const user = createUser(email, password, confirmPassword);
    users.push(user);
    const token = createJwt(user.id);
    res.cookie("token", token);
    return Object.assign({}, user, { token });
  }
  catch(err){
    throw err;
  }
};

const signUpFacebook = async ({ email, userId, accessToken }, { req, res }) => {
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
    const { email: facebookEmail } = data;
    if(facebookEmail !== email) throw new Error("email is not the same");
    const user = createUser(email, "temptemp", "temptemp");
    users.push(user);
    return user;
  }
  catch(err){
    if(err.response) throw err.response.data.error.message;
    throw err;
  }
};

const signIn = ({ email, password }, { req, res }) => {
  const user = getUserByAuth(email, password);
  if(user) {
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

const setMessage = ({message}, { req, res }) => {
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
users.push(createUser("foobar@test.com", "1234", "1234"));
users.push(createUser("ggyy@test.com", "4321", "4321"));

module.exports = {
  getUsers,
  getCurrentUser,
  signUpFacebook,
  signUp,
  signIn,
  signOut,
  setMessage
};
