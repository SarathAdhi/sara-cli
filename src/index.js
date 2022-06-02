#!/usr/bin/env node
import figlet from "figlet";
import inquirer from "inquirer";
import gradient from "gradient-string";
import ora from "ora";
import shell from "shelljs";
import { appendFile } from "fs";
import yargs from "yargs";
import { nextConfigFile, reactConfigFile } from "./config/_tailwind.js";
import { error, success, warning } from "./common/consoleLog.ts";
shell.config.silent = true;

const argv = yargs(process.argv.slice(2));

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

function installTailwind(fileName, framework) {
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

        if (framework === "react") {
          appendFile("tailwind.config.js", reactConfigFile, (res, err) => {
            if (err) {
              error(err);
            } else {
              success(
                "Successfully configured " +
                  gradient.cristal("'Tailwind.config.js'\n")
              );
            }
          });
        } else {
          appendFile("tailwind.config.js", nextConfigFile, (res, err) => {
            if (err) {
              error(err);
            } else {
              success(
                "Successfully configured " +
                  gradient.cristal("'Tailwind.config.js'\n")
              );
            }
          });
        }
        await new Promise((resolve) => setTimeout(resolve, 500));
        await openVsCode();
      }
    }
  );
}

async function installFramework(framework, lang) {
  const { fileName } = await promptOptions([
    {
      type: "input",
      name: "fileName",
      message: "Enter the project name?",
    },
  ]);

  const spinner = ora(`Running create-${framework}-app...`).start();
  if (lang === "js") {
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
        if (dependencies === "Tailwind CSS")
          installTailwind(fileName, framework);
        else {
          success("Done.\n");
          await new Promise((resolve) => setTimeout(resolve, 500));
          shell.cd(fileName);
          await openVsCode();
        }
      }
    });
  } else {
    let cmd;
    if (framework === "next")
      cmd = `npx create-next-app@latest ${fileName} --typescript`;
    else cmd = `npx create-react-app ${fileName} --template typescript`;
    shell.exec(cmd, async (code) => {
      if (code !== 0) {
        error(
          `\nError While installing create-${framework}-app --template typescript. Try changing the file name.`
        );
        shell.exit(1);
      } else {
        spinner.succeed();
        success(
          `\nInstalled create-${framework}-app --template typescript successfully.\n`
        );

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
}

async function main(lang) {
  figlet("Sara CLI", function (err, data) {
    console.log(gradient.pastel.multiline(data));
  });
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const { framework } = await promptOptions([
    {
      name: "framework",
      message: "Which framework would you like to use?",
      type: "list",
      choices: ["React js", "Next js"],
    },
  ]);
  if (framework === "React js") installFramework("react", lang);
  else installFramework("next", lang);
}

const init = () => {
  argv
    .command("init", "Create a project by selecting a .", {
      js: {
        describe: "Language - JavaScript",
      },
      ts: {
        describe: "Language - TypeScript",
      },
    })
    .example("sara init --js or sara init --ts");

  const arg = argv.argv;
  if (arg.js && arg._[0] === "init") main("js");
  else if (arg.ts && arg._[0] === "init") main("ts");
  else argv.showHelp();
};
init();
