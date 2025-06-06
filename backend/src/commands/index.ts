// src/commands/index.ts
// import { ServiceRepoCommand } from './ServiceRepoCommand';
// import { ControllerServiceCommand } from './ControllerServiceCommand';
import { ListRoutesCommand } from "./ListRoutesCommand";
// import { ControllerValidatorCommand } from './ControllerValidatorCommand';

const args = process.argv.slice(2); // Get command-line args (after `node index.js`)
const inputCommand = args[0];

const commandMap: { [key: string]: any } = {
  //   serviceRepo: ServiceRepoCommand,
  //   controllerService: ControllerServiceCommand,
  listRoutes: ListRoutesCommand,
  //   controllerValidator: ControllerValidatorCommand,
};

if (!inputCommand || !commandMap[inputCommand]) {
  console.error(`❌ Unknown or missing command.

Available commands:
  - serviceRepo
  - controllerService
  - listRoutes
  - controllerValidator

Example:
  npm run serviceRepo
`);
  process.exit(1);
}

const SelectedCommand = commandMap[inputCommand];
const commandInstance = new SelectedCommand();

console.log(`\n--- ${commandInstance.name} ---`);
console.log(`${commandInstance.description}\n`);
commandInstance.execute();
