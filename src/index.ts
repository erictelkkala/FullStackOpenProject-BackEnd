import express, { Request } from 'express'

const app = express()
const port = 3001

app.use(express.json())

app.get('/data', (_req: Request, res: any) => {
  res.json({ foo: 'bar' })
})

app.get('/ping', (_req: Request, res: any) => {
  res.json({ pong: 'pong' })
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
