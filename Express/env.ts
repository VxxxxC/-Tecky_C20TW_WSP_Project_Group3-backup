import { config } from "dotenv";

config()
let mode = process.env.NODE_ENV || "development"
const envConfig = config({ path: '.env.' + mode });
if (envConfig.error) {
  console.log("we got and envconfig error : ", envConfig.error)
} else {
  console.log("dotenv config : ", envConfig)
}

export let env: any = {
  DB_NAME: process.env.DB_NAME,
  DB_USER: process.env.DB_USER,
  DB_PASSWORD: process.env.DB_PASSWORD,
  SESSION_SECRET: 'Blog',  // FIXME: 暫時hardcoded
  PORT: 8001,
  DB_HOST: 'localhost',
  NODE_ENV: 'development',
}

if (process.env.NODE_ENV === 'test') {
  env.DB_HOST = process.env.POSTGRES_HOST
  env.DB_NAME = process.env.POSTGRES_DB
  env.DB_USER = process.env.POSTGRES_USER
  env.DB_PASSWORD = process.env.POSTGRES_PASSWORD

  console.log(`HOST: ${env.DB_HOST}, DB:${env.DB_NAME}, USER: ${env.DB_USER}, PASSWORD: ${env.DB_PASSWORD}`)
}
