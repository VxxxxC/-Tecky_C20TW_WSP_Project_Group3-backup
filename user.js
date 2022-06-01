"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRoutes = void 0;
const express_1 = __importDefault(require("express"));
const db_1 = require("./db");
const error_1 = require("./error");
require("./session");
// import { sessionMiddleware } from "./session";
exports.userRoutes = express_1.default.Router();
exports.userRoutes.post("/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //--voliate body,
    //--check username is used by sql
    //--status(400), error
    //--insert username and password
    //-create session
    try {
        let { username, password } = req.body;
        console.log(username);
        console.log(req.body);
        if (!username) {
            res.status(400).json({ error: "missing username(signin)" });
            return;
        }
        if (!password) {
            res.status(400).json({ error: "missing password(signin)" });
            return;
        }
        // result is foundUser, if(result) -> foundUser
        let result = yield db_1.client.query(
        /*sql*/
        "select * from users where username = $1;", [username]);
        // console.log(username)
        if (result.rows.length > 0) {
            //--result = used user
            res.status(400).json({ error: "username is used (signin)" });
            return;
        }
        let newUser = yield db_1.client.query(
        /*sql*/
        "insert into users (username, password) values ($1,$2) returning id", [username, password]);
        // console.log(id.rows[0])
        req.session.user = {
            id: newUser.rows[0].id,
            username: username, is_admin: false
        };
        // console.log(req.session.user);
        res.json({ id: newUser.rows[0].id });
    }
    catch (error) {
        res.status(500).json({ error: String(error) });
    }
    //  return res.redirect("/");
}));
exports.userRoutes.post("/login", (req, res) => {
    console.log(req.body);
    let { username, password } = req.body;
    if (!username) {
        // console.log('missing username');
        res.status(400).json({ error: "missing username(login)" });
        return;
    }
    if (!password) {
        // console.log('missing password');
        res.status(400).json({ error: "missing password(login)" });
        return;
    }
    db_1.client
        .query(
    /**sql */ `
          select id, username,password,is_admin from users where username = $1 and password = $2
          `, [username, password])
        .then((result) => {
        let user = result.rows;
        console.log({ user });
        let username = result.rows[0].username;
        //   console.log(username);
        if (!username) {
            //   console.log('user not found');
            res.status(400).json({ error: "users not found" });
            return;
        }
        let password = result.rows[0].password;
        if (!password) {
            res.status(400).json({ error: "password not found" });
            return;
        }
        req.session.user = {
            id: result.rows[0].id,
            username: username,
            is_admin: result.rows[0].is_admin
        };
        //     console.log(req.session.user)
        //  res.json({id:result.rows[0].id})
        console.log(req.session.user);
        res.json({ message: 'Login successful!' });
    })
        .catch((0, error_1.catchError)(res));
});
//logout
exports.userRoutes.post("/logout", (req, res) => {
    req.session.destroy((error) => {
        if (error) {
            console.error("logout", error);
        }
        // res.redirect('/login')
        // res.json({message:'Logout successful!'})
        res.json({ role: "guest" });
    });
});
//--role--
exports.userRoutes.get("/is_admin", (req, res) => {
    if (req.session.user) {
        if (req.session.user.is_admin) {
            res.json({ role: "admin" });
        }
        else {
            res.json({ role: "member" });
        }
    }
    else {
        res.status(401).json({ msg: "Please login first!" });
    }
});
exports.userRoutes.get("/session", (req, res) => {
    var _a;
    if ((_a = req.session) === null || _a === void 0 ? void 0 : _a.user) {
        res.json(req.session.user);
    }
    else {
        res.json({ error: 'User does not exist!' });
    }
});
