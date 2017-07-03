const knex = require("../db/knex.js");

module.exports.createPost  = (data) => knex("posts").insert(data).returning("*");
module.exports.updatePost  = (whereQuery, data) => knex("posts").update({ ...data,  updated_at: knex.fn.now() }).returning("*");
module.exports.deletePost  = (whereQuery) => knex("posts").where(whereQuery).del().returning("*");
module.exports.findPost    = (whereQuery) => knex("posts").where(whereQuery).join("uesrs", "users.id", "=", "posts.user_id").select();
module.exports.getAllPosts = () => knex("posts").select();
