import expressSession from 'express-session'
// import { GrantSession } from 'grant'
import { env } from './env'

declare module 'express-session' {
    interface SessionData {
        counter?: number
        user?: {
            id: number
            usernames: string,
            is_admin:boolean
        }
        grant?:GrantSession
    }
    // grant?:GrantSession
  }
}



//FIXME: 開server有error: [express-session deprecated req.secret; provide secret option]

export let sessionMiddleware = expressSession({
  secret: env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
})
