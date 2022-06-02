"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sessionMiddleware = void 0;
const express_session_1 = __importDefault(require("express-session"));
const env_1 = require("./env");
//FIXME: 開server有error: [express-session deprecated req.secret; provide secret option]
exports.sessionMiddleware = (0, express_session_1.default)({
    secret: env_1.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
});
