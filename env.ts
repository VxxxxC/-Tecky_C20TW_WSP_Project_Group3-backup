import { config } from "dotenv";

config()


export let env = {
  DB_NAME: 'blog',
  DB_USER: 'postgres',
  DB_PASSWORD: 'abc123',
  SESSION_SECRET: 'test',
  PORT: 8001,
}



