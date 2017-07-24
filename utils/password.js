const bcrypt = require("bcrypt");

const genHash              = (password) => bcrypt.hash(password, 10);
const genHashSync          = (password) => bcrypt.hashSync(password, 10);
const compareHash          = (password, hash) => bcrypt.compare(password, hash);
const compareHashSync      = (password, hash) => bcrypt.compareSync(password, hash);
const validatePassword     = (password) => !!password && typeof password === "string" && password.length >= 8;

module.exports = {
  genHash,
  genHashSync,
  compareHash,
  compareHashSync,
  validatePassword
};
