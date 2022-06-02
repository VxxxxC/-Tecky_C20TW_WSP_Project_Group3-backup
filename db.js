"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.client = void 0;
const pg_1 = require("pg");
const env_1 = require("./env");
exports.client = new pg_1.Client({
    database: env_1.env.DB_NAME,
    user: env_1.env.DB_USER,
    password: env_1.env.DB_PASSWORD
});
