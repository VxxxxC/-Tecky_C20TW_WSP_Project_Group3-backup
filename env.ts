import { config } from "dotenv";

config()
const envConfig = config();
if (envConfig.error) {
  console.log("we got and envconfig error : ", envConfig.error)
} else {
  console.log("dotenv config : ", envConfig)
}

export let env = {
  DB_NAME: process.env.DB_NAME,
  DB_USER: process.env.DB_USER,
  DB_PASSWORD: process.env.DB_PASSWORD,
  SESSION_SECRET: 'test',  // FIXME: 暫時hardcoded
  // GOOGLE_CLIENT_ID: '',
  // GOOGLE_CLIENT_SECRET: '',
  // ORIGIN: 'http://localhost:8001',
  PORT: 8001,
}