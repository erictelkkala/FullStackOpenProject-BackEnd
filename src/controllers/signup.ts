import argon2 from 'argon2'
import express, { Request, Response } from 'express'

import { UserModel } from '../db/userSchema.js'

const signupRouter = express.Router()

signupRouter.post('/', async (req: Request, res: Response) => {
  try {
    const { name, password } = req.body

    // Check if user already exists
    const userExists = await UserModel.findOne({ name })
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' })
    }

    // Hash password
    const hashedPassword = await argon2.hash(password)

    // Create a new user
    const user = new UserModel({ name: name, password: hashedPassword })

    // Save user to database
    await user.save()
  } catch (err) {
    console.log(err)
    return res.status(500).json({ message: 'Internal server error' })
  }

  return res.json({ message: 'User created' })
})

export default signupRouter
