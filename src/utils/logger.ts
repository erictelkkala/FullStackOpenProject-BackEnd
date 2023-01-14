import chalk from 'npm:chalk';

chalk.level = 1;

/**
 * @example
 * Calling the logger:
 * ```ts
 * logger.log('message')
 * ```
 */
const logger = {
	log(message: string) {
		console.log(chalk.white(message));
	},
	error(message: string) {
		console.log(chalk.red(message));
	},
	warning(message: string) {
		console.log(chalk.yellow(message));
	},
	success(message: string) {
		console.log(chalk.green(message));
	},
	info(message: string) {
		console.log(chalk.blue(message));
	},
};

export default logger;
