import { GraphQLError } from 'graphql'
import jwt, { JwtPayload } from 'jsonwebtoken'

import { ItemModel } from '../db/itemSchema.js'
import { Order, OrderModel } from '../db/orderSchema.js'
import logger from '../utils/logger.js'

function handleError(err: any) {
  logger.error(err)
}

const orderResolver = {
  Query: {
    allOrders: async (context: any) => {
      if (!context.token) {
        throw new GraphQLError('Not authenticated', {
          extensions: {
            code: 'UNAUTHENTICATED'
          }
        })
      }
      // TODO: Find out why categories field is not getting populated
      return await OrderModel.find({}).populate('orderItems').populate('user')
    },
    getOrder: async (_parent: any, args: any, context: any) => {
      if (!context.token) {
        throw new GraphQLError('Not authenticated', {
          extensions: {
            code: 'UNAUTHENTICATED'
          }
        })
      }
      return OrderModel.findById(args.id).populate('orderItems').populate('user')
    }
  },
  Mutation: {
    addOrder: async (_parent: any, args: any, context: any) => {
      if (!context.token) {
        throw new GraphQLError('Not authenticated', {
          extensions: {
            code: 'UNAUTHENTICATED'
          }
        })
      }

      //   Validate that the total sum of the order is correct
      let totalSum = 0
      for (const item of args.orderItems as { _id: string; quantity: number }[]) {
        const itemFromDb = await ItemModel.findById(item._id)
        if (!itemFromDb) {
          throw new GraphQLError('Item does not exist', {
            extensions: {
              code: 'BAD_USER_INPUT'
            }
          })
        }
        if (item.quantity > itemFromDb.listing_quantity) {
          throw new GraphQLError('Quantity is greater than the available quantity', {
            extensions: {
              code: 'BAD_USER_INPUT'
            }
          })
        }
        const itemPrice = itemFromDb.listing_price
        totalSum += itemPrice * item.quantity
      }
      if (totalSum !== args.totalPrice) {
        throw new GraphQLError('Total sum is not correct', {
          extensions: {
            code: 'BAD_USER_INPUT'
          }
        })
      }
      //   Validate that the user is the same as the one in the token
      const token = context.token.split(' ')[1]

      const decodedToken = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload
      if (decodedToken.id !== args.user) {
        throw new GraphQLError('User is not the same as the one in the token', {
          extensions: {
            code: 'BAD_USER_INPUT'
          }
        })
      }

      const newOrder = new OrderModel(args as Order)
      await newOrder
        .save()
        .then(() => {
          newOrder.populate('orderItems')
          newOrder.populate('user')
          logger.info(`Order ${newOrder} added`)
        })
        .catch((e) => {
          handleError(e)
          throw new GraphQLError('Order could not be added', {
            extensions: {
              code: 'INTERNAL_SERVER_ERROR'
            }
          })
        })
      return newOrder
    }
  }
}

export default orderResolver
