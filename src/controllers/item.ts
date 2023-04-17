import express, { Request, Response } from 'express'
import { expressjwt, Request as JWTRequest } from 'express-jwt'

import { addItem, findOneItem, getAllItems } from '../db/itemOperations.js'
import { Item } from '../db/itemSchema.js'

const itemRouter = express.Router()

itemRouter.get('/', async (_req: Request, res: Response) => {
  const items = await getAllItems()

  if (items) {
    res.status(200).send(items as Item[])
  } else {
    res.status(404).send({ message: 'Cannot find items' })
  }
})
itemRouter.get('/:id', async (req: Request, res: Response) => {
  const id = req.params.id
  const item = findOneItem(id)

  if (item) {
    return res.status(200).send((await item) as Item)
  } else {
    return res.status(404).send({ message: 'Cannot find item' })
  }
})

itemRouter.post(
  '/add',
  expressjwt({ secret: process.env.JWT_SECRET as string, algorithms: ['HS512'] }),
  (req: JWTRequest, res: Response) => {
    if (!req.auth) return res.sendStatus(401)
    const item = req.body as Item
    return addItem(item)
      .then(() => {
        return res.status(201).send({ message: 'Item added' })
      })
      .catch(() => {
        return res.status(400).send({ message: 'Item was not valid' })
      })
  }
)

export default itemRouter
