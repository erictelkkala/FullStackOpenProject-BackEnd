import express, { Request } from 'express'
import morgan from 'morgan'

import logger from './utils/logger.js'

import { addItem } from './db/itemOperations.js'

const app = express()

// Log requests to the console if not in production
if (process.env.NODE_ENV !== 'production') {
  logger.warning('Not in production')
  app.use(morgan('dev'))
}

app.use(express.json())

app.get('/data', (_req: Request, res: any) => {
  res.json({ foo: 'bar' })
})

app.get('/ping', (_req: Request, res: any) => {
  res.json({ pong: 'pong' })
})

app.post('/addItem', (req: Request, res: any) => {
  addItem(req)
  res.json({ message: 'Item added' })
})

export default app
