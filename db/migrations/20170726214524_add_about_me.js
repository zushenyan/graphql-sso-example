
exports.up = function(knex, Promise) {
  return knex.schema.table("users", (table) => {
    table.text("about");
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.table("users", (table) => {
    table.dropColumn("about");
  });
};
