import expressSession from 'express-session'
import { env } from './env'

declare module 'express-session' {
    interface SessionData {
        counter?: number
        user?: {
            id: number
            username: string,
            is_admin:boolean
        }
    }
  }




//FIXME: 開server有error: [express-session deprecated req.secret; provide secret option]

export let sessionMiddleware = expressSession({
  secret: env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
})
