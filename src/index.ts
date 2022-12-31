import * as dotenv from 'dotenv' // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config()

import app from './app.js'
import logger from './utils/logger.js'

import mongoose from 'mongoose'

const port = 3001
const server_url = process.env.MONGODB_URI || ''

// This will give a warning if set true (default), will be set false in Mongoose 7.0
mongoose.set('strictQuery', false)

// Wait for the database connection to be established
logger.info('Connecting to MongoDB...')
await mongoose.connect(server_url).then(() => {
  logger.success('Connected to database')
})

app.listen(port, () => {
  logger.success(`🚀 Server ready at http://localhost:${port}/`)
})
