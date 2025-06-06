import BaseCommand from "../core/BaseCommand";
import fs from "fs";
import path from "path";
import chalk from "chalk";
import ora from "ora";
import Table from "cli-table3";

type Route = {
  method: string;
  path: string;
};

type RouterInfo = {
  prefix: string;
  routerVar: string;
  file: string;
};

export class ListRoutesCommand extends BaseCommand {
  name = "List Routes";
  description = "Lists all defined routes with global prefixes.";

  private routesDir = path.join(__dirname, "..", "routes");
  private appFile = path.join(__dirname, "..", "app.ts");

  async execute() {
    const spinner = ora(
      chalk.blue("Scanning routes and global prefixes...")
    ).start();
    const allRoutes: Record<string, Route[]> = {};
    const routerMappings: RouterInfo[] = [];

    try {
      this.traverseRoutes(this.routesDir, allRoutes);
      this.parseAppUses(this.appFile, routerMappings);

      spinner.succeed(chalk.green("Routes and global prefixes found!\n"));

      // 1. Display app.use base routes
      console.log(chalk.bold.underline.green(`📚 Global Route Prefixes:`));
      const prefixTable = new Table({
        head: [chalk.bold.blue("Prefix"), chalk.bold.blue("Router")],
        colWidths: [30, 40],
      });

      routerMappings.forEach((use) => {
        prefixTable.push([
          chalk.cyan(use.prefix),
          chalk.magenta(use.routerVar),
        ]);
      });

      console.log(prefixTable.toString());

      // 2. Grouped routes by file
      for (const [file, routes] of Object.entries(allRoutes)) {
        const controllerName = file.replace(/Route\.ts$/, " Controller");

        const routerInfo = routerMappings.find((r) => {
          const fileName =
            r.file.charAt(0).toLocaleUpperCase() + r.file.slice(1);
          return fileName === file;
        });
        const prefix = routerInfo?.prefix || "";

        console.log(
          chalk.bold.underline.magenta(
            `\n📦 ${controllerName} (${routes.length} routes)`
          )
        );

        if (prefix) {
          console.log(chalk.green(`Global Prefix: ${chalk.yellow(prefix)}\n`));
        } else {
          console.log(
            chalk.red(`⚠️  No global prefix found for this controller\n`)
          );
        }

        const table = new Table({
          head: [chalk.bold.blue("HTTP Method"), chalk.bold.blue("Full Path")],
          colWidths: [20, 60],
        });

        routes.forEach((route) => {
          const fullPath = prefix ? `${prefix}${route.path}` : route.path;
          table.push([chalk.yellow(route.method), chalk.cyan(fullPath)]);
        });

        console.log(table.toString());
      }
    } catch (error) {
      spinner.fail(chalk.red("Failed to scan."));
      console.error(error);
    }
  }

  private traverseRoutes(dir: string, allRoutes: Record<string, Route[]>) {
    fs.readdirSync(dir).forEach((file) => {
      const fullPath = path.join(dir, file);
      if (fs.statSync(fullPath).isDirectory()) {
        this.traverseRoutes(fullPath, allRoutes);
      } else if (file.endsWith("Route.ts")) {
        this.findRoutes(fullPath, allRoutes);
      }
    });
  }

  private findRoutes(filePath: string, allRoutes: Record<string, Route[]>) {
    const content = fs.readFileSync(filePath, "utf8");
    const regex = /router\.(get|post|put|delete|patch)\s*\(\s*['"`](.*?)['"`]/g;
    const fileName = path.basename(filePath);

    if (!allRoutes[fileName]) {
      allRoutes[fileName] = [];
    }

    let match;
    while ((match = regex.exec(content)) !== null) {
      allRoutes[fileName].push({
        method: match[1].toUpperCase(),
        path: match[2],
      });
    }
  }

  private parseAppUses(filePath: string, routerMappings: RouterInfo[]) {
    const content = fs.readFileSync(filePath, "utf8");
    const regex = /app\.use\(\s*['"`](.*?)['"`]\s*,\s*(\w+Router)\s*\)/g;

    let match;
    while ((match = regex.exec(content)) !== null) {
      const prefix = match[1];
      const routerVar = match[2];

      // Guess the file name from the routerVar
      const fileNameGuess = this.guessRouteFile(routerVar);
      routerMappings.push({
        prefix,
        routerVar,
        file: fileNameGuess,
      });
    }
  }

  private guessRouteFile(routerVar: string) {
    // stockLogRouter => StockLogRoute.ts
    if (routerVar.endsWith("Router")) {
      const baseName = routerVar.replace(/Router$/, "");
      return `${baseName}Route.ts`;
    }
    return `${routerVar}.ts`;
  }
}
