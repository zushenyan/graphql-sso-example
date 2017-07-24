const { genHash } = require("utils/password.js");

exports.up = async function(knex, Promise) {
  const users    = await knex("users").select();
  const promises = users.map((user) => {
    const { password } = user;
    const hash         = genHash(password);
    return knex("users").update({ password: hash });
  });
  return Promise.all(promises);
};

exports.down = function(knex, Promise) {
  return Promise.resolve();
};
