import { knex } from './knex';

console.log('NODE_ENV:', process.env.NODE_ENV);

describe('knex migrate test', () => {

   test('migration should pass', async () => {

      await knex.migrate.rollback();
      await knex.migrate.latest();
   })

   test('should running seed without error', async () => {
      await knex.seed.run();
   })

})