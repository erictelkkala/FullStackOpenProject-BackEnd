import mongoose from 'npm:mongoose'

import 'npm:dotenv/config'

import app from './app.ts'
import logger from './utils/logger.ts'

const port = process.env.PORT || 8080
const server_url = process.env.MONGODB_URI || ''

// This will give a warning if set true (default), will be set false in Mongoose 7.0
mongoose.set('strictQuery', false)

// Wait for the database connection to be established
logger.info('Connecting to MongoDB...')

const MongoDB = async () => {
  try {
    await mongoose.connect(server_url).then(() => {
      logger.success('Connected to database')
    })
  } catch (error) {
    logger.error(error)
    process.exit(1)
  }
}

MongoDB().then(() => {
  app.listen(port, () => {
    logger.success(`Server ready at port ${port}`)
  })
})
