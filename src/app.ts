import express, { Request } from 'express'
import morgan from 'morgan'

const app = express()

// Log requests to the console if not in production
if (process.env.NODE_ENV !== 'production') {
  console.log('Not in production')
  app.use(morgan('dev'))
}

app.get('/data', (_req: Request, res: any) => {
  res.json({ foo: 'bar' })
})

app.get('/ping', (_req: Request, res: any) => {
  res.json({ pong: 'pong' })
})

export default app
