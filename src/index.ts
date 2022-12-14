import express from 'express'

const app = express()
const port = 3001

app.get('/data', (req: Request, res: any) => {
  res.json({ foo: 'bar' })
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
