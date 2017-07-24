exports.up = async function(knex, Promise) {
  await Promise.all([
    knex.schema.createTableIfNotExists("users", (table) => {
      table.increments("id").primary();
      table.string("email").notNullable();
      table.string("password").notNullable();
      table.string("facebook_id");
      table.string("google_id");
      table.timestamps(true, true);

      table.unique("email");
      table.unique("facebook_id");
      table.unique("google_id");
    })
  ]);
};

exports.down = async function(knex, Promise) {
  await knex.schema.dropTableIfExists("users");
};
