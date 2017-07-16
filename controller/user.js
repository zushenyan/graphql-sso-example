const userModel = require("models/user.js");
const {
  createJWT,
  verifyJWT
} = require("utils/jwt.js");

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
  const result = verifyJWT(jwt);
  if(result.error){
    return {
      status: 400,
      error:  result.error
    };
  }
  const { sub: id } = result;
  const user = await userModel.find({ id }).first();
  if(!user){
    return {
      status:  404,
      error: `user ${id} not found`
    };
  }
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
  if(password.trim() !== confirmPassword.trim()) {
    return {
      status:  400,
      error: `passwords don't match!`
    }
  };
  const user  = (await userModel.create({ email, password }))[0];
  return Object.assign({}, generatePublicUserInfo(user), { token: createJWT(user.id) });
};

const signIn = async ({ email, password }) => {
  const user = await userModel.find({ email, password }).first();
  if(!user){
    return {
      status:  401,
      error: `Invalid email or password`
    };
  }
  return Object.assign({}, generatePublicUserInfo(user), { token: createJWT(user.id) });
};

const signInWithSSO = async (vendorVerification, idColumnName) => {
  const { id, email } = vendorVerification();
  const existUser     = await userModel.find({ [idColumnName]: id }).first() || await userModel.find({ email }).first();
  const updatedUser   = (
    existUser ?
    await userModel.update({ id: existUser.id }, { [idColumnName]: id }) :
    await userModel.create({ email, password: "whatever", [idColumnName]: id })
  )[0];
  return Object.assign({}, generatePublicUserInfo(updatedUser), { token: createJWT(updatedUser.id) });
};

const signOut = () => {
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
  signIn,
  signInWithSSO,
  signOut
};
