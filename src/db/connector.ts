import { Database, MongoDBConnector } from '../utils/deps.ts';

export const connector = new MongoDBConnector({
	uri: Deno.env.get('MONGODB_URI') || '',
	database: 'full_stack',
});
