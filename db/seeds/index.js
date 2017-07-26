const faker            = require("faker");
const _                = require("lodash");
const { genHashSync } = require("utils/password.js");

faker.seed(123);
faker.locale = "en_US";

const users = _.range(5).map((val, index) => ({
  id:       index + 1,
  email:    faker.internet.email(),
  password: genHashSync(faker.internet.password()),
  about:    faker.lorem.words()
}));

exports.seed = async function(knex, Promise) {
  await knex("users").del();

  await knex("users").insert(users);

  await knex.raw(`ALTER SEQUENCE users_id_seq RESTART WITH ${users.length + 1}`);
};
