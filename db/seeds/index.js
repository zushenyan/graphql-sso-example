const users = [
  {
    email: "foobar@test.com",
    password: "1234",
    message: "first message"
  },
  {
    email: "ggyy@test.com",
    password: "4321",
    message: "lallala"
  }
];

exports.seed = function(knex, Promise) {
  return knex("users").del()
    .then(() => knex("users").insert(users));
};
