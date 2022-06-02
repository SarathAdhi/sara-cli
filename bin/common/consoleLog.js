import chalk from "chalk";

export function success(message) {
  console.log(chalk.bold.greenBright(message));
}
export function warning(message) {
  console.log(chalk.yellow(message));
}
export function error(message) {
  console.log(chalk.bold.redBright(message));
}
export function bgWhite(message) {
  console.log(chalk.inverse.bold(message));
}
