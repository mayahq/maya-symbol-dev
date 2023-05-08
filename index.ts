// filetool.ts
import { parse } from "https://deno.land/std@0.114.0/flags/mod.ts";
import { extname } from "https://deno.land/std@0.114.0/path/mod.ts";
import { exists } from "https://deno.land/std@0.114.0/fs/mod.ts";

async function readFile(filePath: string): Promise<void> {
  try {
    const fileContent = await Deno.readTextFile(filePath);
    console.log(fileContent);
  } catch (error) {
    console.error("Error reading file:", error);
  }
}

async function writeFile(filePath: string, content: string): Promise<void> {
  try {
    await Deno.writeTextFile(filePath, content);
    console.log("File written successfully.");
  } catch (error) {
    console.error("Error writing file:", error);
  }
}

function dummy () {}

async function main() {
  const args = parse(Deno.args);
  const subcommand = args._[0];
  const filePath = args._[1];

  if (!subcommand || !filePath || typeof filePath !== "string") {
    console.error("Usage: symd [gen-schema] <filepath>");
    Deno.exit(1);
  }

  if (extname(filePath) !== ".ts") {
    console.error("Please provide a TypeScript file with a '.ts' extension.");
    Deno.exit(1);
  }

  if (!(await exists(filePath))) {
    console.error(`File "${filePath}" does not exist.`);
    Deno.exit(1);
  }

  if (subcommand === "gen-schema") {
    const module = await import(filePath);
    const DefaultExportedClass = module.default;
    const classInstance = new DefaultExportedClass(dummy)

    const symbolProps = classInstance.properties;
    const jsonProps = JSON.stringify(symbolProps, null, 2);
    const schemaPath = filePath.split(".ts")[0] + "-schema.json"
    await writeFile(schemaPath, jsonProps)

//   } else if (subcommand === "write") {
//     const content = args.content || "";
//     await writeFile(filePath, content);
  } else {
    console.error("Invalid subcommand. Please use 'read' or 'write'.");
    Deno.exit(1);
  }
}

main();
