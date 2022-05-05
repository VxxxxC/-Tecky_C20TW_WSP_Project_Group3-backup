import expressSession from 'express-session'
import {env} from './env'

declare module 'express-session'{
    interface SessionData {
        counter?:number,
        user?:{
            id:number
            usernames:string
        }
    }
}

export let sessionMiddleware = expressSession({
    secret : env.SESSION_SECRET,
    resave : true,
    saveUninitialized : true,
})