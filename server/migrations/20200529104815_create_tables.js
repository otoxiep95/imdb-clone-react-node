exports.up = function (knex) {
  return knex.schema
    .createTable("users", (table) => {
      table.increments("id");
      table.string("username");
      table.string("email").notNullable();
      table.string("password").notNullable();
      table.string("recovery_link");
      table.boolean("recovery_link_status").defaultTo(false);
    })
    .createTable("watchLink", (table) => {
      table.increments("id");
      table.integer("user_id").unsigned().notNullable();
      table.integer("movie_id").unsigned().notNullable();
      
      table
        .foreign("user_id")
        .references("id")
        .inTable("users")
        .onDelete("CASCADE")
        .onUpdate("CASCADE");
    })
    .createTable("review", (table) => {
      table.increments("id");
      table.integer("rating").unsigned();
      table.string("title");
      table.string("content");
      table.timestamp("created_at").defaultTo(knex.fn.now());
      table.integer("user_id").unsigned().notNullable();
      table.integer("movie_id").unsigned().notNullable();

      table
        .foreign("user_id")
        .references("id")
        .inTable("users")
        .onDelete("CASCADE")
        .onUpdate("CASCADE");
    })
    .createTable("movieLike", (table) => {
      table.increments("id");
      table.integer("user_id").unsigned().notNullable();
      table.integer("movie_id").unsigned().notNullable();

      table
        .foreign("user_id")
        .references("id")
        .inTable("users")
        .onDelete("CASCADE")
        .onUpdate("CASCADE");
    });
};

exports.down = function (knex) {
  return (
    knex.schema
      .dropTableIfExists("movieLike")
      .dropTableIfExists("watchlink")
      .dropTableIfExists("review")
      .dropTableIfExists("users")
  );
};
