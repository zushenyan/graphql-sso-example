const _ = require("lodash");
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

const createUser = (users, email, password, confirmPassword, message = "this is a default message") => {
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

const getUserInfo = ({ id }) => {
  const user = getUserById(id);
  if(user) {
    return {
      id:      user.id,
      email:   user.email,
      message: user.message
    };
  }
  throw new Error(`user [${id}] not found`);
};

const signUp = ({ email, password, confirmPassword }, { req, res }) => {
  try {
    const user  = createUser(users, email, password, confirmPassword);
    users.push(user);
    const token = createJwt(user.id);
    res.cookie("token", token);
    return Object.assign({}, user, { token });
  }
  catch(err){
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
users.push(createUser(users, "foobar@test.com", "1234", "1234"));
users.push(createUser(users, "ggyy@test.com", "4321", "4321"));

module.exports = {
  getUsers,
  getUserInfo,
  signUp,
  signIn,
  setMessage
};
