import mongoose from 'mongoose'

import app from './app.js'
import logger from './utils/logger.js'

const port = process.env.PORT || 3001
const server_url = process.env.MONGODB_URI || ''

// This will give a warning if set true (default), will be set false in Mongoose 7.0
mongoose.set('strictQuery', false)

// Wait for the database connection to be established
logger.info('Connecting to MongoDB...')

const MongoDB = async () => {
  try {
    mongoose.connect(server_url).then(() => {
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
