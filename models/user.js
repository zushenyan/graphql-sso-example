const knex = require("db/knex.js");

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
