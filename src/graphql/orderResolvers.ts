import { GraphQLError } from 'graphql'
import jwt, { JwtPayload } from 'jsonwebtoken'

import { Order, OrderModel } from '../db/orderSchema.js'
import logger from '../utils/logger.js'

function handleError(err: any) {
  logger.error(err)
}

const orderResolver = {
  Query: {
    allOrders: async () => {
      return OrderModel.find({})
    }
  },
  Mutation: {
    // TODO: Check if order_items is empty due to the response
    addOrder: async (_parent: any, args: any, context: any) => {
      if (!context.token) {
        throw new GraphQLError('Not authenticated', {
          extensions: {
            code: 'UNAUTHENTICATED'
          }
        })
      }

      //   Validate that the total sum of the order is correct
      const totalSum = args.order_items.reduce((acc: number, item: any) => {
        return acc + item.listing_price * item.quantity
      }, 0)
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
