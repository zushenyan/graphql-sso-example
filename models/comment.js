const knex = require("../db/knex.js");

module.exports.createComment  = (data) => knex("comments").insert(data).returning("*");
module.exports.updateComment  = (whereQuery, data) => knex("comments").update({ ...data,  updated_at: knex.fn.now() }).returning("*");
module.exports.deleteComment  = (whereQuery) => knex("comments").where(whereQuery).del().returning("*");
module.exports.findComment    = (whereQuery) => knex("comments").where(whereQuery).select().join("uesrs", "users.id", "=", "comments.user_id");
module.exports.getAllComments = () => knex("comments").select();
