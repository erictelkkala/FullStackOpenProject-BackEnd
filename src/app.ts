import express, { Request, Response } from 'express'
import helmet from 'helmet'
import morgan from 'morgan'

import loginRouter from './controllers/login.js'
import signupRouter from './controllers/signup.js'
import itemRouter from './controllers/item'

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

// Routes
app.use('/api/login', loginRouter)
app.use('/api/signup', signupRouter)
app.use('/items', itemRouter)

app.get('/data', (_req: Request, res: Response) => {
  res.json({ foo: 'bar' })
})

app.get('/ping', (_req: Request, res: Response) => {
  res.json({ pong: 'pong' })
})

export default app
