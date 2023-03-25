import express, { Request, Response } from 'express'
import { addItem, findOneItem, getAllItems } from '../db/itemOperations.js'
import { expressjwt, Request as JWTRequest } from 'express-jwt'

const itemRouter = express.Router()

itemRouter.get('/', async (_req: Request, res: Response) => {
  const items = await getAllItems()

  if (items) {
    res.status(200).send(items)
  } else {
    res.status(404).send({ message: 'Cannot find items' })
  }
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

itemRouter.post(
  '/add',
  expressjwt({ secret: process.env.JWT_SECRET as string, algorithms: ['HS512'] }),
  (req: JWTRequest, res: Response) => {
    if (!req.auth) return res.sendStatus(401)
    const item = req.body
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
