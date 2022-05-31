#!/usr/bin/env node
import d from "figlet";
import e from "inquirer";
import f from "gradient-string";
import g from "ora";
import a from "shelljs";
import { appendFile as h } from "fs";
import b from "yargs";
import i from "chalk";
a.config.silent = !0;
let j = b(process.argv.slice(2));
function k(a) {
  console.log(i.bold.greenBright(a));
}
function l(a) {
  console.log(i.yellow(a));
}
function m(a) {
  console.log(i.bold.redBright(a));
}
function n(a) {
  console.log(i.inverse.bold(a));
}
async function o(b) {
  let c = await e.prompt(b).catch((b) => {
    b.isTtyError, b(b), a.exit(1);
  });
  return c;
}
async function p() {
  let { response: b } = await o([
    {
      name: "response",
      message: "Would you like to the project in VS Code?",
      type: "list",
      choices: ["yes", "no"],
    },
  ]);
  "yes" === b &&
    a.exec("code .", (b) => {
      0 !== b
        ? (l(
            "\nProject created successfully. Failed to open VS Code or VS Code not found"
          ),
          a.exit(1))
        : (k("\nSuccessfully opened the project in VS code."), a.exit(1));
    });
}
function q(b) {
  let c = g("Installing Tailwind CSS...").start();
  a.cd(b),
    a.exec("npm install -D tailwindcss postcss autoprefixer", async (b) => {
      0 !== b
        ? (m("Error: While installing create react app"), a.exit(1))
        : (c.succeed(),
          a.exec("npx tailwindcss init -p"),
          k("\nSuccessfully installed Tailwind CSS."),
          a.rm("tailwind.config.js"),
          h(
            "tailwind.config.js",
            `module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
};
`,
            (b, a) => {
              a
                ? m(a)
                : k(
                    "Successfully configured " +
                      f.cristal("'Tailwind.config.js'\n")
                  );
            }
          ),
          await new Promise((a) => setTimeout(a, 500)),
          await p());
    });
}
async function r(b) {
  let { fileName: c } = await o([
      { type: "input", name: "fileName", message: "Enter the project name?" },
    ]),
    d = g(`Running create-${b}-app...`).start();
  a.exec(`npx create-${b}-app ${c}`, async (e) => {
    if (0 !== e)
      m(`
Error While installing create-${b}-app. Try changing the file name.`),
        a.exit(1);
    else {
      d.succeed(),
        k(`
Installed create-${b}-app successfully.
`);
      let { dependencies: f } = await o([
        {
          name: "dependencies",
          message: "Would you like to install the following dependencies?",
          type: "list",
          choices: ["Plain project", "Tailwind CSS"],
        },
      ]);
      "Tailwind CSS" === f
        ? q(c)
        : (k("Done.\n"),
          await new Promise((a) => setTimeout(a, 500)),
          a.cd(c),
          await p());
    }
  });
}
async function s() {
  d("Sara CLI", function (b, a) {
    console.log(f.pastel.multiline(a));
  }),
    await new Promise((a) => setTimeout(a, 1e3));
  let { framework: a } = await o([
    {
      name: "framework",
      message: "Which framework would you like to use?",
      type: "list",
      choices: ["React js", "Next js"],
    },
  ]);
  "React js" === a ? r("react") : r("next");
}
let c = () => {
  j.command("init", "Create a project by selecting a language.", {
    js: { describe: "Language - JavaScript" },
    ts: { describe: "Language - TypeScript" },
  }).example("sara init --js or sara init --ts");
  let a = j.argv;
  a.js && "init" === a._[0] ? s() : j.showHelp();
};
c();
