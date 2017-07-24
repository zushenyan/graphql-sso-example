const faker            = require("faker");
const _                = require("lodash");
const { genHashSync } = require("utils/password.js");

faker.seed(123);
faker.locale = "en_US";

const users = _.range(5).map((val, index) => ({
  id:       index + 1,
  email:    faker.internet.email(),
  password: genHashSync(faker.internet.password())
}));

const posts = _.range(10).map((val, index) => {
  const userId = Math.floor(Math.random() * users.length) + 1;
  return {
    id:      index + 1,
    user_id: userId,
    content: faker.lorem.sentence()
  };
});

exports.seed = async function(knex, Promise) {
  await knex("posts").del();
  await knex("users").del();

  await knex("users").insert(users);
  await knex("posts").insert(posts);

  await knex.raw(`ALTER SEQUENCE posts_id_seq RESTART WITH ${posts.length + 1}`);
  await knex.raw(`ALTER SEQUENCE users_id_seq RESTART WITH ${users.length + 1}`);
};
