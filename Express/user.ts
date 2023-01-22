import express from "express";
import { client } from "./db";
import { catchError } from "./error";
import "./session";
// import { sessionMiddleware } from "./session";

export let userRoutes = express.Router();
// userRoutes.use(express.urlencoded({ extended: true }));
// userRoutes.use(sessionMiddleware);

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
      "select * from users where username = $1;",
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
      "insert into users (username, password) values ($1,$2) returning id",
      [username, password]
    );
    // console.log(id.rows[0])
    req.session.user = {
      id: newUser.rows[0].id,
      username: username,
      is_admin: false,
    };
    // console.log(req.session.user);
    res.json({ id: newUser.rows[0].id });
  } catch (error) {
    res.status(500).json({ error: String(error) });
  }

  //  return res.redirect("/");
});

userRoutes.post("/login", (req, res) => {
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
  client
    .query(
      /**sql */ `
          select id, username,password,is_admin from users where username = $1 and password = $2
          `, [username, password]
    )
    .then((result: any) => {
      let user = result.rows
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


      console.log(req.session.user);

      res.json({ message: 'Login successful!' })
    })
    .catch(catchError(res));
});

//logout
userRoutes.post("/logout", (req, res) => {
  req.session.destroy((error) => {
    if (error) {
      console.error("logout", error);
    }
     res.json({message:'Logout successful!'})
  });
});

//--role--
userRoutes.get("/is_admin", (req, res) => {
  if (req.session.user) {
    if (req.session.user.is_admin) {
      res.json({ role: "admin" })
    } else {
      res.json({ role: "member" })
    }
  } else {
    res.status(401).json({ msg: "Please login first!" })
  }
});

userRoutes.get("/session", (req, res) => {
  if (req.session?.user) {
    res.json(req.session.user);
  } else {
    res.json({ error: 'User does not exist!' });
  }
});
