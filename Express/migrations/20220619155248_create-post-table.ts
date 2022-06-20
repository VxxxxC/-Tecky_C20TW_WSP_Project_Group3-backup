import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
   await knex.schema.createTable('post', (table) => {
      table.increments('id');
      table.string('title').notNullable();
      table.string('content').notNullable();
      table.string('image');
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.timestamp('updated_at').defaultTo(knex.fn.now());

      table.integer('users_id').references('id').inTable('users');
      // ** Below two Syntax combine to be same as above **
      // table.integer('users_id').unsigned;
      // table.foreign('users_id').references('id').inTable('users');
   })
}


export async function down(knex: Knex): Promise<void> {
   await knex.schema.dropTable('post');
}

