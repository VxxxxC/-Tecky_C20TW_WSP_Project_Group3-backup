import express, { NextFunction, Request, Response } from "express";
import { resolve } from "path";
import { client } from "./db";
import { catchError } from "./error";
import { print } from "listening-on";
import "./session";
import { sessionMiddleware } from "./session";

export let userRoutes = express.Router();
userRoutes.use(express.urlencoded({ extended: false }));
userRoutes.use(sessionMiddleware);

export type user = {
  usesnames: string;
  password: string;
};

userRoutes.post("/signup", async (req, res) => {
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
    let result = await client.query(
      /*sql*/
      "select * from users where usernames = $1;",
      [username]
    );
    // console.log(username)
    if (result.rows.length > 0) {
      //--result = used user
      res.status(400).json({ error: "username is used (signin)" });
      return;
    }

    let newUser = await client.query(
      /*sql*/
      "insert into users (usernames, passwords) values ($1,$2) returning id",
      [username, password]
    );
    // console.log(id.rows[0])
    req.session.user = {
      id: newUser.rows[0].id,
      usernames: username,
    };
    console.log(req.session.user);
    res.json({ id: newUser.rows[0].id });
  } catch (error) {
    res.status(500).json({ error: String(error) });
  }

  //  return res.redirect("/");
});

userRoutes.post("/login", (req, res) => {
  let { username, password } = req.body;
  if (!username) {
    res.status(400).json({ error: "missing username(login)" });
    return;
  }
  if (!password) {
    res.status(400).json({ error: "missing password(login)" });
    return;
  }
  client
    .query(
      /**sql */ `
          select id, usernames,passwords from users where usernames ='${username}'
          `
    )
    .then((result: any) => {
      let username = result.rows[0].usernames;
      if (!username) {
        res.status(400).json({ error: "users not found" });
        return;
      }
      let password = result.rows[0].passwords;
      if (!password) {
        res.status(400).json({ error: "password not found" });
        return;
      }
      req.session.user = {
        id: result.rows[0].id,
        usernames: username,
      };
      //res.json({id:result.rows[0].id})
      res.redirect("/");
    })
    .catch(catchError(res));
});

//logout
userRoutes.post("/logout", (req, res) => {
  req.session.destroy((error) => {
    if (error) {
      console.error("logout", error);
    }
    res.json({ role: "guest" });
    res.redirect("/index");
  });
});

//--role--
userRoutes.get("/role", (req, res) => {
  if (req.session?.user) {
    res.json({ role: "admin" });
  } else {
    res.json({ role: "otheruser" });
  }
});

userRoutes.get("/session", (req, res) => {
  if (req.session?.user) {
    res.json(req.session.user);
  } else {
    res.json({});
  }
});
