import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'

export const checkJwt = async (req: Request, res: Response, next: NextFunction) => {
  const headerToken = req.headers.authorization
  if (headerToken) {
    const token = headerToken.split(' ')[1]
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || '')
      req.headers['user'] = decoded as string
      next()
    } catch (error) {
      res.status(401).json({ message: 'Invalid token' })
    }
  }
}
