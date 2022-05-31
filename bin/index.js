#!/usr/bin/env node

import figlet from "figlet";
import inquirer from "inquirer";
import gradient from "gradient-string";
import ora from "ora";
import shell from "shelljs";
import { appendFile } from "fs";
import yargs from "yargs";
import chalk from "chalk";
shell.config.silent = true;

const argv = yargs(process.argv.slice(2));

function success(message) {
  console.log(chalk.bold.greenBright(message));
}
function warning(message) {
  console.log(chalk.yellow(message));
}
function error(message) {
  console.log(chalk.bold.redBright(message));
}
function bgWhite(message) {
  console.log(chalk.inverse.bold(message));
}

async function promptOptions(_prompt) {
  const result = await inquirer.prompt(_prompt).catch((error) => {
    if (error.isTtyError) {
      error(error);
      shell.exit(1);
    } else {
      error(error);
      shell.exit(1);
    }
  });
  return result;
}

async function openVsCode() {
  const { response } = await promptOptions([
    {
      name: "response",
      message: "Would you like to the project in VS Code?",
      type: "list",
      choices: ["yes", "no"],
    },
  ]);
  if (response === "yes") {
    shell.exec("code .", (code) => {
      if (code !== 0) {
        warning(
          "\nProject created successfully. Failed to open VS Code or VS Code not found"
        );
        shell.exit(1);
      } else {
        success("\nSuccessfully opened the project in VS code.");
        shell.exit(1);
      }
    });
  }
}

function installTailwind(fileName) {
  const spinner = ora("Installing Tailwind CSS...").start();
  shell.cd(fileName);

  shell.exec(
    `npm install -D tailwindcss postcss autoprefixer`,
    async (code) => {
      if (code !== 0) {
        error("Error: While installing create react app");
        shell.exit(1);
      } else {
        spinner.succeed();
        shell.exec("npx tailwindcss init -p");
        success("\nSuccessfully installed Tailwind CSS.");
        shell.rm("tailwind.config.js");
        appendFile(
          "tailwind.config.js",
          `module.exports = {
          content: ["./src/**/*.{js,jsx,ts,tsx}"],
          theme: {
            extend: {},
          },
          plugins: [],
        };
        `,
          (res, err) => {
            if (err) {
              error(err);
            } else {
              success(
                "Successfully configured " +
                  gradient.cristal("'Tailwind.config.js'\n")
              );
            }
          }
        );
        await new Promise((resolve) => setTimeout(resolve, 500));
        await openVsCode();
      }
    }
  );
}

async function installFramework(framework) {
  const { fileName } = await promptOptions([
    {
      type: "input",
      name: "fileName",
      message: "Enter the project name?",
    },
  ]);

  const spinner = ora(`Running create-${framework}-app...`).start();
  shell.exec(`npx create-${framework}-app ${fileName}`, async (code) => {
    if (code !== 0) {
      error(
        `\nError While installing create-${framework}-app. Try changing the file name.`
      );
      shell.exit(1);
    } else {
      spinner.succeed();
      success(`\nInstalled create-${framework}-app successfully.\n`);

      const { dependencies } = await promptOptions([
        {
          name: "dependencies",
          message: "Would you like to install the following dependencies?",
          type: "list",
          choices: ["Plain project", "Tailwind CSS"],
        },
      ]);
      if (dependencies === "Tailwind CSS") installTailwind(fileName);
      else {
        success("Done.\n");
        await new Promise((resolve) => setTimeout(resolve, 500));
        shell.cd(fileName);
        await openVsCode();
      }
    }
  });
}

async function main() {
  // Displaying Geeks CLI
  figlet("Sara CLI", function (err, data) {
    console.log(gradient.pastel.multiline(data));
  });
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const { framework } = await promptOptions([
    {
      name: "framework",
      message: "Which framework would you like to",
      type: "list",
      choices: ["React js", "Next js"],
    },
  ]);
  if (framework === "React js") installFramework("react");
  else installFramework("next");
}

// main();
const init = () => {
  argv
    .command("init", "Create a project by selecting a language.", {
      js: {
        describe: "Language - JavaScript",
      },
      ts: {
        describe: "Language - TypeScript",
      },
    })
    .example("sara init --js or sara init --ts");

  const arg = argv.argv;
  if (arg.js && arg._[0] === "init") main();
  else argv.showHelp();
};
init();

// const greeting = `Hello, ${options.name}!`;
// test();
