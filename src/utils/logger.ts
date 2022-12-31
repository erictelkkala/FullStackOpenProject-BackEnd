import chalk from 'chalk'

chalk.level = 1

const logger = {
  log(message: string) {
    console.log(chalk.white(message))
  },
  error(message: string) {
    console.log(chalk.red(message))
  },
  warning(message: string) {
    console.log(chalk.yellow(message))
  },
  success(message: string) {
    console.log(chalk.green(message))
  },
  info(message: string) {
    console.log(chalk.blue(message))
  }
}

export default logger
