import Knex, { Knex as KnexType } from "knex";
import { env } from "./env";

let configs = require("./knexfile");
let mode = env.NODE_ENV;
let config = configs[mode];

export let knex: KnexType = Knex(config);
