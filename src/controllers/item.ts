import express, { Request, Response } from 'npm:express';
import { addItem, findOneItem, getAllItems } from '../db/itemOperations.ts';

const itemRouter = express.Router();

itemRouter.get('/', async (_req: Request, res: Response) => {
	const items = await getAllItems();

	if (items) {
		res.status(200).send(items);
	} else {
		res.status(404).send({ message: 'Cannot find items' });
	}
});
itemRouter.get('/:id', async (req: Request, res: Response) => {
	const id = req.url;
	const item = await findOneItem(id);

	if (item) {
		return res.status(200).send(item);
	} else {
		return res.status(404);
	}
});

itemRouter.post('/add', (req: Request, res: Response) => {
	const item = req.body;
	addItem(item)
		.then(() => {
			res.status(201).send({ message: 'Item added' });
		})
		.catch(() => {
			res.status(400).send({ message: 'Item was not valid' });
		});
});

export default itemRouter;
