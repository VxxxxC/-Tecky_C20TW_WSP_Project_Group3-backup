import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("users", (table) => {
    table.increments("id");
    table.string("username");
    table.string("password");
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
    table.boolean("is_admin");
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable("users");
}
