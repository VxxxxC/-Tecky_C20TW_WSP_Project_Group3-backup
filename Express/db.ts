import { Client } from "pg"
import { env } from "./env"


export let client = new Client({
    host: env.POSTGRES_HOST,
    database: env.POSTGRES_DB,
    user: env.POSTGRES_USER,
    password: env.POSTGRES_PASSWORD

})

