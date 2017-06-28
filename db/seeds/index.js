const faker = require("faker");
const _ = require("lodash");

faker.seed(123);
faker.locale = "en_US";

const users = _.range(5).map((val, index) => ({
  id:       index + 1,
  email:    faker.internet.email(),
  password: faker.internet.password()
}));

const posts = users.map((val, index) => ({
  id:      index + 1,
  user_id: val.id,
  content: faker.lorem.sentence()
}));

exports.seed = async function(knex, Promise) {
  await knex("posts").del();
  await knex("users").del();

  await knex("users").insert(users);
  await knex("posts").insert(posts);
};
