import { config } from "dotenv";
import { cleanEnv } from "envalid";
import { port, str } from "envalid/dist/validators";

config();

export const env = cleanEnv(process.env, {
  PORT: port({ default: 5000 }),
  DATABASE_URL: str(),
  NODE_ENV: str({ choices: ["development", "production", "test"] }),
});
