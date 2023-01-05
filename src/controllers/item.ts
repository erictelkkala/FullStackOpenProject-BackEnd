import express, { Request, Response } from 'express'
import { addItem, findOneItem, getAllItems } from '../db/itemOperations'

const itemRouter = express.Router()

itemRouter.get('/', async (res: Response) => {
  res.status(200).send(await getAllItems())
})
itemRouter.get('/:id', async (req: Request, res: Response) => {
  const id = req.url
  const item = findOneItem(id)

  if (item) {
    return res.status(200).send(item)
  } else {
    return res.status(404)
  }
})

itemRouter.post('/add', (req: Request, res: Response) => {
  const item = req.body
  addItem(item)
    .then(() => {
      res.status(201).send({ message: 'Item added' })
    })
    .catch(() => {
      res.status(400).send({ message: 'Item was not valid' })
    })
})

export default itemRouter
