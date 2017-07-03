const faker = require("faker");
const _     = require("lodash");

faker.seed(123);
faker.locale = "en_US";

const users = _.range(5).map((val, index) => ({
  id:       index + 1,
  email:    faker.internet.email(),
  password: faker.internet.password()
}));

const posts = _.range(10).map((val, index) => {
  const userId = Math.floor(Math.random() * users.length) + 1;

  return {
    id:      index + 1,
    user_id: userId,
    title:   faker.lorem.word(),
    content: faker.lorem.sentence()
  };
});

const comments = _.range(10).map((val, index) => {
  const userId = Math.floor(Math.random() * users.length) + 1;
  const postId = Math.floor(Math.random() * posts.length) + 1;
  return {
    id:      index + 1,
    user_id: userId,
    post_id: postId,
    content: faker.lorem.words()
  }
});

exports.seed = async function(knex, Promise) {
  await knex("comments").del();
  await knex("posts").del();
  await knex("users").del();

  await knex("users").insert(users);
  await knex("posts").insert(posts);
  await knex("comments").insert(comments);

  await knex.raw(`ALTER SEQUENCE comments_id_seq RESTART WITH ${comments.length + 1}`);;
  await knex.raw(`ALTER SEQUENCE posts_id_seq RESTART WITH ${posts.length + 1}`);;
  await knex.raw(`ALTER SEQUENCE users_id_seq RESTART WITH ${users.length + 1}`);;
};
