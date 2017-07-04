const knex = require("../db/knex.js");

module.exports.find = (whereQuery) =>
  knex("comments")
    .where(whereQuery)
    .join("posts", "posts.id", "=", "comments.post_id")
    .join("users", "users.id", "=", "comments.user_id")
    .select("*");

module.exports.getAll = () =>
  knex("comments")
    .join("posts", "posts.id", "=", "comments.post_id")
    .join("users", "users.id", "=", "comments.user_id")
    .select("*");

module.exports.create = (data) =>
  knex("comments")
    .insert(data)
    .returning("*");

module.exports.update = (whereQuery, data) =>
  knex("comments")
    .where(whereQuery)
    .update(Object.assign({}, data, { updated_at: knex.fn.now() }))
    .returning("*");

module.exports.del = (whereQuery) =>
  knex("comments")
    .where(whereQuery)
    .del()
    .returning("*");
