import chalk from "chalk";
import fs from "fs";
import path from "path";
import app from "./app";
import { env } from "./config";
import ora from "ora";

const PORT = env.PORT || 5000;
const pkg = JSON.parse(
  fs.readFileSync(path.join(__dirname, "../package.json"), "utf-8")
);

function startMessage() {
  console.clear();
  console.log(
    chalk.green.bold(`🚀 ${pkg.name.toUpperCase()} Started Successfully!`)
  );
  console.log(
    chalk.blueBright(
      `🌍 Environment: ${chalk.yellow(env.NODE_ENV || "development")}`
    )
  );
  console.log(
    chalk.magenta(`📦 Listening on port: ${chalk.cyan(PORT.toString())}`)
  );
  console.log(chalk.gray(`🕒 Started at: ${new Date().toLocaleTimeString()}`));
  console.log(chalk.white.bold("------------------------------------------"));

  setInterval(() => {
    const uptimeSeconds = Math.floor(process.uptime());
    const hours = Math.floor(uptimeSeconds / 3600);
    const minutes = Math.floor((uptimeSeconds % 3600) / 60);
    const seconds = uptimeSeconds % 60;
    console.log(
      chalk.greenBright(`⏳ Server Uptime: ${hours}h ${minutes}m ${seconds}s`)
    );
  }, 10000);
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function startServer() {
  const spinner = ora("Starting the server...").start();

  try {
    await delay(3000);

    app.listen(PORT, () => {
      spinner.succeed(`Server is running on port ${PORT} 🚀`);
      startMessage();
    });
  } catch (error) {
    spinner.fail("Failed to start the server ❌");
    console.error(error);
    process.exit(1);
  }
}

startServer();
