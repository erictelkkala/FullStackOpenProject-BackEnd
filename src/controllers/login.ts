import argon2 from 'npm:argon2'
import express, { Request, Response } from 'npm:express'
import jwt from 'npm:jsonwebtoken'

import { UserModel } from '../db/userSchema.ts'

const loginRouter = express.Router()

loginRouter.post('/', async (req: Request, res: Response) => {
  const { name, password } = req.body
  // Check if user exists
  const user = await UserModel.findOne({ name: { $eq: name } })
  if (!user) {
    return res.status(401).json({ message: 'User not found' })
  }
  // Check if password is correct
  const validPassword = await argon2.verify(user.password, password)
  if (!validPassword) {
    return res.status(401).json({ message: 'Invalid password' })
  }
  // Create JWT
  const token = jwt.sign({ userId: user.id, name: user.name }, process.env.JWT_SECRET as string, {
    expiresIn: '1d'
  })

  return res.status(200).json({ token, id: user.id })
})

export default loginRouter
