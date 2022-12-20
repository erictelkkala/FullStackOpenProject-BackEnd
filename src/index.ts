import * as dotenv from 'dotenv' // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config()

import express, { Request } from 'express'

import mongoose from 'mongoose'

const app = express()
const port = 3001

mongoose.set('strictQuery', false)

const server_url = process.env.MONGO_SERVER_URL || ''

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
