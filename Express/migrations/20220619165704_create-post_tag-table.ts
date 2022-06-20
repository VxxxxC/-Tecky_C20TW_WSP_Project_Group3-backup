import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
   await knex.schema.createTable('post_tag', (table) => {
      table.increments('id');
      table.integer('post_id').references('id').inTable('post');
      table.integer('tags_id').references('id').inTable('tags');
   })
}


export async function down(knex: Knex): Promise<void> {
   await knex.schema.dropTable('post_tag');
}

