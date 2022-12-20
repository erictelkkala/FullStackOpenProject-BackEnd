import express, { Request } from 'express'

const app = express()
const port = 3001

app.get('/data', (_req: Request, res: any) => {
  res.json({ foo: 'bar' })
})

app.get('/ping', (_req: Request, res: any) => {
  res.json({ pong: 'pong' })
})

app.listen(port, () => {
  console.log(`🚀 Server ready at http://localhost:${port}/`)
})
