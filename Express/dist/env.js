"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
let mode = process.env.NODE_ENV || "development";
const envConfig = (0, dotenv_1.config)({ path: '.env.' + mode });
if (envConfig.error) {
    console.log("we got and envconfig error : ", envConfig.error);
}
else {
    console.log("dotenv config : ", envConfig);
}
exports.env = {
    DB_NAME: process.env.DB_NAME,
    DB_USER: process.env.DB_USER,
    DB_PASSWORD: process.env.DB_PASSWORD,
    SESSION_SECRET: 'Blog',
    PORT: 8001,
    DB_HOST: 'localhost',
    NODE_ENV: 'development',
};
if (process.env.NODE_ENV === 'test') {
    exports.env.DB_HOST = process.env.POSTGRES_HOST;
    exports.env.DB_NAME = process.env.POSTGRES_DB;
    exports.env.DB_USER = process.env.POSTGRES_USER;
    exports.env.DB_PASSWORD = process.env.POSTGRES_PASSWORD;
    console.log(`HOST: ${exports.env.DB_HOST}, DB:${exports.env.DB_NAME}, USER: ${exports.env.DB_USER}, PASSWORD: ${exports.env.DB_PASSWORD}`);
}
