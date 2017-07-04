const knex = require("../db/knex.js");

module.exports.find = (whereQuery) =>
  knex("users")
    .where(whereQuery)
    .select("*");

module.exports.getAll = () =>
  knex("users")
    .select("*");

module.exports.create = (data) =>
  knex("users")
    .insert(data)
    .returning("*");

module.exports.update = (whereQuery, data) =>
  knex("users")
    .where(whereQuery)
    .update(Object.assign({}, data, { updated_at: knex.fn.now() }))
    .returning("*");

// const _              = require("lodash");
// const { generateID } = require("../utils");
//
// const users = [];
//
// const getAllUsers         = () => users;
// const getUserById         = (id) => _.find(users, (user) => user.id === id);
// const getUserByEmail      = (email) => _.find(users, (user) => user.email === email);
// const getUserByAuth       = (email, password) => _.find(users, (user) => user.email === email && user.password === password);
// const getUserByFacebookId = (id) => _.find(users, (user) => user.facebookId === id);
// const getUserByGoogleId   = (id) => _.find(users, (user) => user.googleId === id);
//
// const createUser = ({
//     email,
//     password,
//     confirmPassword,
//     message = "this is a default message",
//     facebookId,
//     googleId
//   }) => {
//   if(email.length === 0) throw new Error(`email can't be empty`);
//   if(getUserByEmail(email)) throw new Error(`email [${email}] has already been taken`);
//   if(password !== confirmPassword) throw new Error(`passwords don't match`);
//   if(password.length === 0 || confirmPassword.length === 0) throw new Error("");
//   const user = {
//     id: generateID(),
//     email,
//     password,
//     message,
//     facebookId,
//     googleId
//   };
//   users.push(user);
//   return user;
// };
//
// const updateUser = ({ id, data = {} }) => {
//   const user = getUserById(id);
//   if(user){
//     Object.keys(data).forEach((key) => {
//       if(user.hasOwnProperty(key)) {
//         user[key] = data[key];
//       };
//     });
//     return user;
//   }
//   throw new Error(`user ${id} not found`);
// };
//
// module.exports = {
//   getAllUsers,
//   getUserById,
//   getUserByEmail,
//   getUserByAuth,
//   getUserByFacebookId,
//   getUserByGoogleId,
//   createUser,
//   updateUser
// };
