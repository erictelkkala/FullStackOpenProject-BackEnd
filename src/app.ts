import express, { Request, Response } from 'express'
import helmet from 'helmet'
import morgan from 'morgan'

import loginRouter from './controllers/login.js'
import signupRouter from './controllers/signup.js'
import { addItem, getAllItems } from './db/itemOperations.js'
import logger from './utils/logger.js'

const app = express()

app.use(helmet()) // https://helmetjs.github.io/

// Log requests to the console if not in production
if (process.env.NODE_ENV !== 'production') {
  logger.warning('Not in production')
  app.use(morgan('dev'))
}

app.use(express.json())

// Redirect http to https
app.use(function (req: Request, res: Response, next) {
  if (req.get('X-Forwarded-Proto') == 'http') {
    // request was via http, so redirect to https
    res.redirect('https://' + req.headers.host + req.url)
  } else {
    next()
  }
})

// Routes for login and signup
app.use('/api/login', loginRouter)
app.use('/api/signup', signupRouter)

app.get('/data', (_req: Request, res: Response) => {
  res.json({ foo: 'bar' })
})

app.get('/ping', (_req: Request, res: Response) => {
  res.json({ pong: 'pong' })
})

app.get('/getItems', async (_req: Request, res: Response) => {
  res.json(await getAllItems())
})

app.post('/addItem', (req: Request, res: Response) => {
  addItem(req).then(() => {
    res.status(201).json({ message: 'Item added' })
  })
})

export default app
