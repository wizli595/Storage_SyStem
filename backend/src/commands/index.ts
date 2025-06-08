import BaseCommand from "../core/BaseCommand";
import { ListRoutesCommand } from "./ListRoutesCommand";
import { RelationCommand } from "./RelationCommand";
// import { ArchitectureValidatorCommand } from "./ArchitectureValidatorCommand";

// Initialize command instances
const commandInstances: { [key: string]: BaseCommand } = {
  listRoutes: new ListRoutesCommand(),
  relation: new RelationCommand(),
  // validateArchitecture: new ArchitectureValidatorCommand(),
};

// Helper to show help
function showGlobalHelp() {
  console.log(`\n✅ Available Commands:\n`);
  for (const [cmd, instance] of Object.entries(commandInstances)) {
    console.log(`  ${cmd.padEnd(25)} - ${instance.description}`);
  }
  console.log(`\n👉 Example:\n  npm run validateArchitecture -- --help\n`);
}

// Parse args
const args = process.argv.slice(2); // ex: [relation, --help]
const inputCommand = args[0];
const inputFlags = args.slice(1); // ex: [--help]

if (!inputCommand || inputCommand === "-h" || inputCommand === "--help") {
  showGlobalHelp();
  process.exit(0);
}

const commandInstance = commandInstances[inputCommand];

if (!commandInstance) {
  console.error(`\n❌ Unknown command: ${inputCommand}`);
  showGlobalHelp();
  process.exit(1);
}

// If user types: npm run relation -- --help
if (inputFlags.includes("-h") || inputFlags.includes("--help")) {
  console.log(`\n📚 Help for command: ${inputCommand}`);
  console.log(`\n${commandInstance.description}\n`);
  process.exit(0);
}

// If no --help, execute
console.log(`\n--- ${commandInstance.name} ---`);
console.log(`${commandInstance.description}\n`);
commandInstance.execute();
