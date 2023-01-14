import { NextFunction, Request, Response } from 'npm:express';
import jwt from 'npm:jsonwebtoken';
import logger from './logger.ts';

export const checkJwt = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	const headerToken = req.headers.authorization;
	if (headerToken) {
		const token = headerToken.split(' ')[1];
		try {
			const decoded = await jwt.verify(
				token,
				process.env.JWT_SECRET || '',
			);
			req.headers['user'] = decoded as string;
			next();
		} catch (error) {
			logger.error(error);
			res.status(401).json({ message: 'Invalid token' });
		}
	}
};
