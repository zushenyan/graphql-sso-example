const knex = require("../db/knex.js");

module.exports.find = (whereQuery) =>
  knex("posts")
    .where(whereQuery)
    .join("users", "users.id", "=", "posts.user_id")
    .select("*");

module.exports.getAll = () =>
  knex("posts")
    .join("users", "users.id", "=", "posts.user_id")
    .select("*");

module.exports.create = (data) =>
  knex("posts")
    .insert(data)
    .returning("*");

module.exports.update = (whereQuery, data) =>
  knex("posts")
    .where(whereQuery)
    .update(Object.assign({}, data, { updated_at: knex.fn.now() }))
    .returning("*");

module.exports.del = (whereQuery) =>
  knex("posts")
    .where(whereQuery)
    .del()
    .returning("*");
