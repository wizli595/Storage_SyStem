import BaseCommand from "../core/BaseCommand";
import fs from "fs";
import path from "path";
import chalk from "chalk";
import ora from "ora";

interface MethodRelation {
  controllerMethod: string;
  serviceClass?: string;
  serviceMethod?: string;
  repositoryClass?: string;
  repositoryMethod?: string;
}

interface ControllerRelations {
  [controllerName: string]: MethodRelation[];
}

export class RelationCommand extends BaseCommand {
  name = "Relation Command";
  description = "Shows Controller → Service → Repository method relations.";

  private readonly controllersDir = path.join(__dirname, "..", "controllers");
  private readonly servicesDir = path.join(__dirname, "..", "services");

  async execute(): Promise<void> {
    const spinner = ora(
      chalk.blue("Analyzing controller-service-repository relations...")
    ).start();

    try {
      const relations = this.analyzeRelations();
      spinner.succeed(chalk.green("Relations analyzed successfully!\n"));
      this.displayRelations(relations);
    } catch (error) {
      spinner.fail(chalk.red("Failed to analyze relations."));
      console.error(error);
    }
  }

  private analyzeRelations(): ControllerRelations {
    const relations: ControllerRelations = {};
    const controllerFiles = this.getFiles(this.controllersDir, "Controller.ts");

    for (const controllerFile of controllerFiles) {
      const controllerPath = path.join(this.controllersDir, controllerFile);

      const controllerContent = fs.readFileSync(controllerPath, "utf8");
      const controllerName = controllerFile.replace(".ts", "");

      relations[controllerName] =
        this.extractControllerRelations(controllerContent);
    }

    return relations;
  }

  private getFiles(dir: string, suffix: string): string[] {
    return fs.readdirSync(dir).filter((file) => file.endsWith(suffix));
  }

  private extractControllerRelations(content: string): MethodRelation[] {
    const methodRelations: MethodRelation[] = [];
    const methodRegex = /async (\w+)\s*\(.*\)\s*{/g;
    let match: RegExpExecArray | null;
    while ((match = methodRegex.exec(content)) !== null) {
      const controllerMethod = match[1];
      console.log(`Found controller method: ${controllerMethod}`);
      const serviceCall = this.findServiceCall(content, match.index);

      if (serviceCall) {
        const { serviceVar, serviceMethod } = serviceCall;
        const serviceClass = this.capitalize(serviceVar) + "Service";
        const repoCall = this.findRepositoryCall(serviceClass, serviceMethod);

        methodRelations.push({
          controllerMethod,
          serviceClass,
          serviceMethod,
          ...repoCall,
        });
      } else {
        methodRelations.push({ controllerMethod });
      }
    }

    return methodRelations;
  }

  private findServiceCall(content: string, startIdx: number) {
    const snippet = content.slice(startIdx, startIdx + 500);
    const regex = /this\.(\w+)Service\.(\w+)\(/;
    const match = regex.exec(snippet);

    if (match) {
      return { serviceVar: match[1], serviceMethod: match[2] };
    }
    return null;
  }

  private findRepositoryCall(serviceClass: string, serviceMethod: string) {
    const serviceFile = this.findServiceFile(serviceClass);
    if (!serviceFile) {
      return {};
    }

    const serviceContent = fs.readFileSync(serviceFile, "utf8");
    const methodRegex = new RegExp(
      `async ${serviceMethod}\\s*\\(.*\\)\\s*{`,
      "g"
    );
    const match = methodRegex.exec(serviceContent);

    if (match) {
      const startIdx = match.index;
      const bodySnippet = serviceContent.slice(startIdx, startIdx + 500);
      const repoRegex = /this\.(\w+)Repository\.(\w+)\(/;
      const repoMatch = repoRegex.exec(bodySnippet);

      if (repoMatch) {
        return {
          repositoryClass: this.capitalize(repoMatch[1]) + "Repository",
          repositoryMethod: repoMatch[2],
        };
      }
    }
    return {};
  }

  private findServiceFile(serviceClass: string): string | null {
    const serviceFiles = this.getFiles(this.servicesDir, ".ts");

    for (const serviceFile of serviceFiles) {
      const servicePath = path.join(this.servicesDir, serviceFile);
      const content = fs.readFileSync(servicePath, "utf8");

      const classRegex = new RegExp(`export\\s+class\\s+${serviceClass}\\s+`);
      if (classRegex.test(content)) {
        return servicePath;
      }
    }

    return null;
  }

  private displayRelations(relations: ControllerRelations): void {
    for (const [controller, methods] of Object.entries(relations)) {
      console.log(
        chalk.bold.underline.magenta(`\n📦 Controller: ${controller}`)
      );

      methods.forEach((method) => {
        console.log(
          `\n   ${chalk.yellow("🔧")} Method: ${chalk.bold(
            method.controllerMethod
          )}`
        );

        if (method.serviceClass && method.serviceMethod) {
          console.log(
            `     ${chalk.green("🧩")} Service: ${chalk.green(
              method.serviceClass
            )}.${chalk.green(method.serviceMethod)}`
          );

          if (method.repositoryClass && method.repositoryMethod) {
            console.log(
              `       ${chalk.cyan("💾")} Repository: ${chalk.cyan(
                method.repositoryClass
              )}.${chalk.cyan(method.repositoryMethod)}`
            );
          } else {
            console.log(
              `       ${chalk.yellow("⚠️  No repository method found.")}`
            );
          }
        } else {
          console.log(`     ${chalk.red("❌ No service method found.")}`);
        }
      });
    }
  }

  private capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
}
