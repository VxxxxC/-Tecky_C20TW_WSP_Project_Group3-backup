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
<<<<<<< HEAD
  SESSION_SECRET: 'test',
=======
  SESSION_SECRET: 'blog', // FIXME: 暫時hardcoded
>>>>>>> 3e7f16cafad386cc01c25f64b4e46466cd465640
  PORT: 8001,
}