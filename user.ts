import express, { NextFunction, Request, Response } from "express";
import { resolve } from "path";
import { client } from "./db";
import { catchError } from "./error";
import { print } from "listening-on";
import "./session";
import { type } from "os";
import fetch from 'node-fetch'
import { adminGuard } from "./guard";
// import { grantMiddleware } from "./grant";
// import { sessionMiddleware } from "./session";

export let userRoutes = express.Router();
userRoutes.use(express.urlencoded({ extended: false }));
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
      usernames: username,is_admin:true
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
          select id, usernames,passwords,is_admin from users where usernames ='${username}'
          `
    )
    .then((result: any) => {
      let username = result.rows[0].usernames;
   //   console.log(username);
      
      if (!username) {
 //   console.log('user not found');

        res.status(400).json({ error: "users not found" });
        return;
      }
      let password = result.rows[0].passwords;
      if (!password) {
  //      console.log('password not found');
        
        res.status(400).json({ error: "password not found" });
        return;
      }
  //    console.log('係呢到啦！');

      req.session.user = {
        id: result.rows[0].id,
        usernames: username,
        is_admin:result.rows[0].is_admin
      };

 //     console.log(req.session.user)
      
    //  res.json({id:result.rows[0].id})
      res.redirect("/");
    })
    .catch(catchError(res));
});

// //logout
// userRoutes.post("/logout", (req, res) => {
//   req.session.destroy((error) => {
//     if (error) {
//       console.error("logout", error);
//     }
//     res.redirect('/');
//   });
// });

//--role--
userRoutes.get("/is_admin", (req, res) => {
  // if (true) {
  //   res.json({ role: "admin" })
  // } else if(req.session?.user) {
  //   res.json({ role: "member" })
  // }

  if(req.session.user){
    if(req.session.user.is_admin){
      res.json({ role: "admin" })
    }else{
      res.json({ role: "member" })
    }
  }else{
    res.json({msg:"Please login first!"})
  }
});

userRoutes.get("/session", (req, res) => {
  if (req.session?.user) {
    res.json(req.session.user);
  } else {
    res.json({});
  }
});

// //google login
// type GoogleProfile = {
//   email: string
//   picture: string
// }

// userRoutes.get('/login/google', async (req, res) => {
//   console.log('login with google...')
//   console.log('session:', req.session)
//   let access_token = req.session?.grant?.response?.access_token
//   if (!access_token) {
//     res.status(400).json({ error: 'missing access_token in grant session' })
//     return
//   }

//   let profile : GoogleProfile
//   try {
//     let googleRes = await fetch(
//       `https://www.googleapis.com/oauth2/v2/userinfo`,
//       {
//         headers: { Authorization: 'Bearer ' + access_token },
//       },
//     )
//     profile = await googleRes.json()
//   } catch (error) {
//     res.status(502).json({ error: 'Failed to get user info from Google' })
//     return
//   }

//   try {
//     // try to lookup existing users
//     let result = await client.query(
//       /* sql */ `
// select id from users
// where username = $1
// `,
//       [profile.email],
//     )
//     let user = result.rows[0]

//     // auto register if this is a new user
//     if (!user) {
//       result = await client.query(
//         /* sql */ `
// insert into users
// (usernames) values ($1)
// returning id
// `,
//         [profile.email],
//       )
//       user = result.rows[0]
//     }

//     let id = user.id
//     req.session.user = {
//       id,
//       username: profile.email,
//     }
//     // res.json({ id })
//     res.redirect('/')
//   } catch (error) {
//     res.status(500).json({ error: 'Database Error: ' + String(error) })
//   }
// })

