import express, { NextFunction, Request, Response } from 'express'
import { expressjwt, Request as JWTRequest } from 'express-jwt'

import { addItem, findOneItem, getAllItems } from '../db/itemOperations.js'
import { Categories, Item } from '../db/itemSchema.js'

const itemRouter = express.Router()

// Validate item middleware
const itemValidator = (req: Request, res: Response, next: NextFunction) => {
  // UNDEFINED CHECKS
  if (req.body.listing_title === undefined)
    return res.status(400).send({ message: 'Item title is required' })
  if (req.body.listing_description === undefined)
    return res.status(400).send({ message: 'Item description is required' })
  if (req.body.listing_category === undefined)
    return res.status(400).send({ message: 'Item category is required' })
  if (req.body.listing_image === undefined)
    return res.status(400).send({ message: 'Item image is required' })
  if (req.body.listing_price === undefined) req.body.listing_price = 0
  if (req.body.listing_quantity === undefined) req.body.listing_quantity = 1

  // REASSIGN VALUES
  if (req.body.listing_quantity === 0)
    return res.status(400).send({ message: 'Item quantity cannot be 0' })
  if (req.body.listing_quantity < 1)
    return res.status(400).send({ message: 'Item quantity cannot be less than 1' })

  // VALIDATE VALUES
  if (!Object.values(Categories).includes(req.body.listing_category))
    return res.status(400).send({
      message:
        'Item category is not valid, it must be one of these: ' +
        Object.values(Categories).join(', ')
    })
  if (req.body.listing_title.length < 3)
    return res.status(400).send({ message: 'Item title must be at least 3 characters long' })
  if (req.body.listing_description.length < 10)
    return res.status(400).send({ message: 'Item description must be at least 10 characters long' })
  if (req.body.listing_price < 0)
    return res.status(400).send({ message: 'Item price cannot be negative' })
  if (req.body.listing_price === 0)
    return res.status(400).send({ message: 'Item price cannot be 0' })
  if (req.body.listing_price > 1000000)
    return res.status(400).send({ message: 'Item price cannot be more than 1 million euros' })
  return next()
}

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
  itemValidator,
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
