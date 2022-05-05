import express, { NextFunction } from "express";
import { resolve } from "path";
import { client } from "./db";
import {catchError} from "./error"
import { print } from 'listening-on'

import'./session'

export let userRouter = express.Router()

// userRouter.use(express.urlencoded({extend:true}))

export type user = {
    usesnames: string
    password: string
}

userRouter.post('/signin',(req,res)=>{
    let {usernames,password} = req.body
    if(!usernames){
        res.status(400).json({error:"missing username"})
        return
    }
    if(!password){
        res.status(400).json({error:"missing password"})
        return 
    }
    client.
    query(
        /*sql*/`
        insert into users(usernames, password) value ($1,$2)
        returing id
        `,
        [usernames,password],
    ).then((result:any) =>{
        let id = result.row[0].id
        req.session.user = {
            id,
            usernames,}
            res.redirect('/.index')
    })
    .catch((error:Error) =>{
        if(String(Error).includes(`unique`)){
            throw`this username is already in use`
        }
        throw Error 
    })
    .catch(catchError(res))
  
})


userRouter.post('/login',(req,res)=>{
    let {usernames,password} = req.body
    if(!usernames){
        res.status(400).json({error:"missing username"})
        return
    }
    if(!password){
        res.status(400).json({error:"missing password"})
        return 
    }
    client
      .query(
          /**sql */`
          select id,password,usernames from users
          where usernames =$1
          `,
          [usernames],
      )
      .then((result:any) =>{
          let usernames = result.row[0].usernames
          if(!usernames){
            res.status(400).json({error:"users not found"})
            return
          }
          let password =result.row[0].password
          if(!password){
            res.status(400).json({error:"password not found"})
            return
          }
          req.session.user={
              id:result.row[0].id,
              usernames,
          }
          res.json({id:result.row[0].id})
          res.redirect('./index')
      })
      .catch(catchError(res))
     
})

userRouter.get('/session',(req,res)=>{
    if(req.session?.user){
        res.json(req.session.user)
    }else{
        res.json({})
    }
})

//logout
userRouter.post('/logout',(req,res)=>{
    req.session.destroy(error=>{
        if(error){
            console.error('logout',error)
        }
        res.json({role:'guest'})
        res.redirect('/index')
    })
})

userRouter.get('/role',(req,res)=>{
    if(req.session?.user){
        res.json({role:'admin'})
    }else{
        res.json({role:'otheruser'})
    }
})




