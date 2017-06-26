
exports.up = function(knex, Promise) {
  return knex.schema.createTable("users", (table) => {
    table.increments("id").primary();
    table.string("email").notNullable();
    table.string("password").notNullable();
    table.text("message");
    table.timestamps(true, true);
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists("users");
};
