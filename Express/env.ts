import { config } from "dotenv";
import populateEnv from "populate-env";

config()
let mode = process.env.NODE_ENV || "development"
const envConfig = config({ path: '.env.' + mode });
if (envConfig.error) {
  console.log("we got and envconfig error : ", envConfig.error)
} else {
  console.log("dotenv config : ", envConfig)
}

export let env: any = {
  POSTGRES_DB: process.env.POSTGRES_DB,
  POSTGRES_USER: process.env.POSTGRES_USER,
  POSTGRES_PASSWORD: process.env.POSTGRES_PASSWORD,
  SESSION_SECRET: process.env.SESSION_SECRET,
  POSTGRES_HOST: process.env.POSTGRES_HOST,
  NODE_ENV: 'development',

}
console.log(`HOST: ${env.POSTGRES_HOST}, DB:${env.POSTGRES_DB}, USER: ${env.POSTGRES_USER}, PASSWORD: ${env.POSTGRES_PASSWORD}`)
populateEnv(env, { mode: 'halt' })



if (process.env.NODE_ENV === 'test') {
  env.POSTGRES_HOST = process.env.POSTGRES_HOST
  env.POSTGRES_NAME = process.env.POSTGRES_DB
  env.POSTGRES_USER = process.env.POSTGRES_USER
  env.POSTGRES_PASSWORD = process.env.POSTGRES_PASSWORD

  console.log(`HOST: ${env.POSTGRES_HOST}, DB:${env.POSTGRES_NAME}, USER: ${env.POSTGRES_USER}, PASSWORD: ${env.POSTGRES_PASSWORD}`)
}
