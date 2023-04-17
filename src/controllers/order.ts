import express from 'express'
import { expressjwt, Request as JWTRequest } from 'express-jwt'

import { Order } from '../db/orderSchema.js'

const orderRouter = express.Router()

// Requires JWT token
orderRouter.post(
  '/new',
  expressjwt({ secret: process.env.JWT_SECRET as string, algorithms: ['HS512'] }),
  (req: JWTRequest, res) => {
    const order = req.body as Order

    if (!order) {
      return res.status(400).send({ message: 'Order was not valid' })
    }
    return res.status(201).send({ message: 'Order added', order: order })
  }
)

export default orderRouter
