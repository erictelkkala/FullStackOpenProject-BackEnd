import cors from 'cors'
import express, { Request, Response } from 'express'
import rateLimit from 'express-rate-limit'
import helmet from 'helmet'
import morgan from 'morgan'

import itemRouter from './controllers/item.js'
import loginRouter from './controllers/login.js'
import signupRouter from './controllers/signup.js'
import logger from './utils/logger.js'

const app = express()

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false // Disable the `X-RateLimit-*` headers
})

app.use(cors)
app.use(limiter)
// https://helmetjs.github.io/
app.use(helmet.expectCt())
app.use(helmet.frameguard())
app.use(helmet.hidePoweredBy())
app.use(helmet.hsts())
app.use(helmet.ieNoOpen())
app.use(helmet.noSniff())
app.use(helmet.referrerPolicy())
app.use(helmet.xssFilter())

// Log requests to the consol(e if not in production
if (process.env.NODE_ENV !== ('production' || 'prod')) {
  logger.warning('Not in production')
  app.use(morgan('dev'))
}

app.use(express.json())

app.get('/data', (_req: Request, res: Response) => {
  res.json({ foo: 'bar' })
})

app.get('/ping', (_req: Request, res: Response) => {
  res.json({ pong: 'pong' })
})

// Routes
app.use('/api/login', loginRouter)
app.use('/api/signup', signupRouter)
app.use('/api/items', itemRouter)

export default app
