"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const envConfig = (0, dotenv_1.config)();
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
    SESSION_SECRET: 'test',
    PORT: 8001,
};
