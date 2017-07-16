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
    }),
    knex.schema.createTableIfNotExists("posts", (table) => {
      table.increments("id").primary();
      table.integer("user_id").notNullable();
      table.text("content");
      table.timestamps(true, true);

      table.foreign("user_id").references("users.id");
    })
  ]);
};

exports.down = async function(knex, Promise) {
  await knex.schema.dropTableIfExists("posts");
  await knex.schema.dropTableIfExists("users");
};
