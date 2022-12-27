import * as dotenv from 'dotenv' // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config()

import express, { Request } from 'express'

import morgan from 'morgan'

import mongoose from 'mongoose'

const app = express()
const port = 3001

// Log requests to the console if not in production
if (process.env.NODE_ENV !== 'production') {
  console.log('Not in production')
  app.use(morgan('dev'))
}

// This will give a warning if set true (default), will be set false in Mongoose 7.0
mongoose.set('strictQuery', false)

const server_url = process.env.MONGODB_URI || ''

// Wait for the database connection to be established
await mongoose.connect(server_url).then(() => {
  console.log('Connected to database')
})

app.get('/data', (_req: Request, res: any) => {
  res.json({ foo: 'bar' })
})

app.get('/ping', (_req: Request, res: any) => {
  res.json({ pong: 'pong' })
})

app.listen(port, () => {
  console.log(`🚀 Server ready at http://localhost:${port}/`)
})
