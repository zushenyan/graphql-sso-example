const knex = require("../db/knex.js");

module.exports.findPost    = (whereQuery) => knex.select().from("posts").where(whereQuery).join("users", "users.id", "=", "posts.user_id").select("*");
module.exports.getAllPosts = () => knex("posts").join("users", "users.id", "=", "posts.user_id").select();
module.exports.createPost  = (data) => knex("posts").insert(data).returning("*");
module.exports.updatePost  = (whereQuery, data) => knex("posts").update({ ...data,  updated_at: knex.fn.now() }).returning("*");
module.exports.deletePost  = (whereQuery) => knex("posts").where(whereQuery).del().returning("*");
