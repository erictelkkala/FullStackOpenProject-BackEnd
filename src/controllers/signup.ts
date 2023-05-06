import express, { Request, Response } from 'express'

import { addUser } from '../db/userOperations.js'
import { UserModel } from '../db/userSchema.js'

const signupRouter = express.Router()

signupRouter.post('/', async (req: Request, res: Response) => {
  try {
    const { name, password } = req.body

    // Check if user already exists
    const userExists = await UserModel.findOne({ name: { $eq: name } })
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' })
    }

    // Create a new user
    // Password hashing is done in the userSchema
    await addUser({ name: name, password: password })
  } catch (err) {
    console.log(err)
    return res.status(500).json({ message: 'Internal server error' })
  }

  return res.json({ message: 'User created' })
})

export default signupRouter
