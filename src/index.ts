import * as dotenv from 'dotenv' // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
import mongoose from 'mongoose'

import app from './app.js'
import logger from './utils/logger.js'

dotenv.config()

const port = process.env.PORT || 3001
const server_url = process.env.MONGODB_URI || ''

// This will give a warning if set true (default), will be set false in Mongoose 7.0
mongoose.set('strictQuery', false)

// Wait for the database connection to be established
logger.info('Connecting to MongoDB...')
await mongoose.connect(server_url).then(() => {
  logger.success('Connected to database')
})

app.listen(port, () => {
  logger.success(`🚀 Server ready at port ${port}/`)
})
