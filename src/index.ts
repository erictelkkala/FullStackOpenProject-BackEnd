// index.ts
import app from './app.ts';
import logger from './utils/logger.ts';
import { config, Database } from './utils/deps.ts';
import { connector } from './db/connector.ts';

config();

const port = Deno.env.get('PORT') || 8080;

// Wait for the database connection to be established
logger.info('Connecting to MongoDB...');
const db = new Database(connector);

if (db) {
	app.listen(port, () => {
		logger.success(`Server ready at port ${port}`);
	});
} else {
	logger.error('Failed to connect to MongoDB');
}
