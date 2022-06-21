"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.knex = void 0;
const knex_1 = __importDefault(require("knex"));
const env_1 = require("./env");
let configs = require('./knexfile');
let mode = env_1.env.NODE_ENV;
let config = configs[mode];
exports.knex = (0, knex_1.default)(config);
