import express, { Request, Response } from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import rateLimit from 'express-rate-limit'

import loginRouter from './controllers/login.js'
import signupRouter from './controllers/signup.js'
import itemRouter from './controllers/item.js'

import logger from './utils/logger.js'

const app = express()
app.use(cors())
app.use(morgan('dev'))

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false // Disable the `X-RateLimit-*` headers
})

app.use(helmet({ crossOriginResourcePolicy: false, crossOriginEmbedderPolicy: false })) // https://helmetjs.github.io/

// Log requests to the console if not in production
if (process.env.NODE_ENV !== 'production') {
  logger.warning('Not in production')
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

app.get('/data', (_req: Request, res: Response) => {
  res.json({ foo: 'bar' })
})

app.get('/ping', (_req: Request, res: Response) => {
  res.json({ pong: 'pong' })
})

// Routes
app.use('/api/login', loginRouter, limiter)
app.use('/api/signup', signupRouter, limiter)
app.use('/api/items', itemRouter, limiter)

export default app
