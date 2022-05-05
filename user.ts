import express, { NextFunction,Request,Response } from "express";
import { resolve } from "path";
import { client } from "./db";
import {catchError} from "./error"
import { print } from 'listening-on'
import'./session'
import { sessionMiddleware } from "./session";


export let userRoutes = express.Router()
userRoutes.use(express.urlencoded({extended:false}))
userRoutes.use(sessionMiddleware)

export type user = {
    usesnames: string
    password: string
}

userRoutes.post('/signin',async (req,res)=>{
    let {username,password} = req.body
    if(!username){
        res.status(400).json({error:"missing username(signin)"})
        return
    }
    if(!password){
        res.status(400).json({error:"missing password(signin)"})
        return 
    }
    let result = await client.
    query(
        /*sql*/`
       select * from users where usernames = $1;

        `,
        [username],
    )
let foundUser = result.rows[0]
    console.log(result.rows[0]);
    if (password == foundUser.passwords) {
                req.session.user = {
            id:foundUser.id,
            usernames:foundUser.usernames}

    console.log(req.session.user)

        res.json({loginStatus: 'successful'})
        return
    }

    res.json({message:'hi'})
    // .then((result:any) =>{
    //     let id = result.rows[0].id
    //     req.session.user = {
    //         id:result.rows[0].id,
    //         usernames:username,}
    //         res.json({id})
    // })
    // .catch((error:Error) => {
    //     if(String(Error).includes(`unique`)){
    //         throw`this username is already in use`
    //     }
    //     throw Error 
    // })
    // .catch(catchError(res))
})


userRoutes.post('/login',(req,res)=>{
    let {username,password} = req.body
    if(!username){
        res.status(400).json({error:"missing username(login)"})
        return
    }
    if(!password){
        res.status(400).json({error:"missing password(login)"})
        return 
    }
    client
      .query(
          /**sql */`
          select id, usernames,passwords from users where usernames ='${username}'
          `
      )
      .then((result:any) =>{
          let username = result.rows[0].usernames
          if(!username){
            res.status(400).json({error:"users not found"})
            return
          }
          let password =result.rows[0].passwords
          if(!password){
            res.status(400).json({error:"password not found"})
            return
          }
          req.session.user={
              id:result.rows[0].id,
              usernames:username,
          }
          //res.json({id:result.rows[0].id})
          res.redirect('/')
      })
      .catch(catchError(res))
     
})


//logout
userRoutes.post('/logout',(req,res)=>{
    req.session.destroy(error=>{
        if(error){
            console.error('logout',error)
        }
        res.json({role:'guest'})
        res.redirect('/index')
    })
})

//--role--
userRoutes.get('/role',(req,res)=>{
    if(req.session?.user){
        res.json({role:'admin'})
    }else{
        res.json({role:'otheruser'})
    }
})


userRoutes.get('/session',(req,res)=>{
    if(req.session?.user){
        res.json(req.session.user)
    }else{
        res.json({})
    }
})


