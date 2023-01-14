import * as argon2 from "https://deno.land/x/argon2@v0.9.2/lib/mod.ts";
import express, { Request, Response } from 'npm:express';

import { UserModel } from '../db/userSchema.ts';
import { addUser } from '../db/userOperations.ts';

const signupRouter = express.Router();

signupRouter.post('/', async (req: Request, res: Response) => {
	try {
		const { name, password } = req.body;

		// Check if user already exists
		const userExists = await UserModel.findOne({ name: { $eq: name } });
		if (userExists) {
			return res.status(400).json({ message: 'User already exists' });
		}

		// Hash password
		const hashedPassword = await argon2.hash(password);

		// Create a new user
		await addUser({ name: name, password: hashedPassword });
	} catch (err) {
		console.log(err);
		return res.status(500).json({ message: 'Internal server error' });
	}

	return res.json({ message: 'User created' });
});

export default signupRouter;
