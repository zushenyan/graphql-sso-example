const userModel = require("models/user.js");
const {
  createJWT,
  verifyJWT
} = require("utils/jwt.js");
const {
  buildMessage,
  createOk
} = require("utils/http-status-builder");
const {
  genHash,
  genHashSync,
  validatePassword
} = require("utils/password.js");

const generatePublicUserInfo = (user) => ({
  id:          user.id,
  email:       user.email,
  facebook_id: user.facebook_id,
  google_id:   user.google_id,
  created_at:  user.created_at,
  updated_at:  user.updated_at
});

const getAllUsers = async () => {
  const users  = await userModel.getAll();
  const result = users.map(generatePublicUserInfo);
  return Object.assign(
    { users: result },
    createOk(200)
  );
};

const getCurrentUser = async ({ jwt }) => {
  const result = verifyJWT(jwt);
  if(result.error) return buildMessage(400, result.error);
  const { sub: id } = result;
  const user = await userModel.find({ id }).first();
  if(!user) return buildMessage(400, `user ${id} not found`);
  return Object.assign(
    generatePublicUserInfo(user),
    createOk(200)
  );
};

const updateUser = async ({ jwt, data }) => {
  if(data.id)         delete data.id;
  if(data.created_at) delete data.created_at;
  if(data.updated_at) delete data.updated_at;
  if(data.password) data.password = await genHash(data.password);
  const { sub: id } = verifyJWT(jwt);
  const user = (await userModel.update({ id }, data))[0];
  return Object.assign(
    { token: createJWT(user.id) },
    generatePublicUserInfo(user),
    createOk(200)
  );
};

const signUp = async ({ email, password, confirmPassword }) => {
  if(password.trim() !== confirmPassword.trim()) return buildMessage(400, `passwords don't match!`);
  if(!validatePassword(password)) return buildMessage(400, `password should be at least 8 characters`)
  const hash = await genHash(password);
  const user = (await userModel.create({ email, password: hash }))[0];
  return Object.assign(
    { token: createJWT(user.id) },
    generatePublicUserInfo(user),
    createOk(200)
  );
};

const signIn = async ({ email, password }) => {
  const user = await userModel.find({ email, password }).first();
  if(!user) return buildMessage(401, `invalid email or password`);
  return Object.assign(
    { token: createJWT(user.id) },
    generatePublicUserInfo(user),
    createOk(200)
  );
};

const signInWithSSO = async (vendorVerification, idColumnName) => {
  const { id, email } = vendorVerification();
  const existUser     = await userModel.find({ [idColumnName]: id }).first() || await userModel.find({ email }).first();
  const updatedUser   = (
    existUser ?
    await userModel.update({ id: existUser.id }, { [idColumnName]: id }) :
    await userModel.create({ email, password: genHashSync(Date.now().toString()), [idColumnName]: id })
  )[0];
  return Object.assign(
    { token: createJWT(updatedUser.id) },
    generatePublicUserInfo(updatedUser),
    createOk(200)
  );
};

const signOut = () => createOk(200);

module.exports = {
  generatePublicUserInfo,
  getAllUsers,
  getCurrentUser,
  updateUser,
  signUp,
  signIn,
  signInWithSSO,
  signOut
};
