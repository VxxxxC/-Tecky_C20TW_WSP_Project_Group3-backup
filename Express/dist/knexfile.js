"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const env_1 = require("./env");
// Update with your config settings.
exports.config = {
    development: {
        client: "postgresql",
        connection: {
            host: env_1.env.DB_HOST,
            database: env_1.env.DB_NAME,
            user: env_1.env.DB_USER,
            password: env_1.env.DB_PASSWORD
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
            host: env_1.env.DB_HOST,
            database: env_1.env.DB_NAME,
            user: env_1.env.DB_USER,
            password: env_1.env.DB_PASSWORD
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
            host: env_1.env.DB_HOST,
            database: env_1.env.DB_NAME,
            user: env_1.env.DB_USER,
            password: env_1.env.DB_PASSWORD
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
module.exports = exports.config;
