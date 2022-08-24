import type { Knex } from "knex";
import { env } from './env';
console.log(env)
// Update with your config settings.

export const config: { [key: string]: Knex.Config } = {
  development: {
    client: "postgresql",
    connection: {
      host: env.POSTGRES_HOST,
      database: env.POSTGRES_DB,
      user: env.POSTGRES_USER,
      password: env.POSTGRES_PASSWORD
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: "knex_migrations"
    },
  },

  test: {
    client: "postgresql",
    connection: {
      host: env.POSTGRES_HOST,
      database: env.POSTGRES_DB,
      user: env.POSTGRES_USER,
      password: env.POSTGRES_PASSWORD
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: "knex_migrations"
    },
  },

  production: {
    client: "postgresql",
    connection: {
      host: env.POSTGRES_HOST,
      database: env.POSTGRES_DB,
      user: env.POSTGRES_USER,
      password: env.POSTGRES_PASSWORD
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: "knex_migrations"
    },
  }

};

module.exports = config;
