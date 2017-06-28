const knexfile = require("../knexfile.js");

const NODE_ENV = process.env.NODE_ENV || "development";

const config = knexfile[NODE_ENV];

module.exports = require("knex")(config);
