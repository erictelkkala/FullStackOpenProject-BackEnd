import { GraphQLError } from 'graphql'
import mongoose from 'mongoose'

import { MyContext } from '../app.js'
import { ItemModel } from '../db/itemSchema.js'
import { Order, OrderModel } from '../db/orderSchema.js'
import logger from '../utils/logger.js'

function handleError(err: any) {
  logger.error(err)
}

const orderResolver = {
  Query: {
    getAllOrdersByUser: async (_parent: any, _args: any, context: MyContext) => {
      if (!context.currentUser) {
        throw new GraphQLError('Not authenticated', {
          extensions: {
            code: 'UNAUTHENTICATED'
          }
        })
      }

      const order = (await OrderModel.find({ user: context.currentUser.id }).populate([
        { path: 'orderItems', populate: { path: 'item' } }
      ])) as Order[]
      console.log(order.forEach((o) => console.log(o)))
      return order
    },
    getOrder: async (_parent: any, args: any, context: MyContext) => {
      if (!context.currentUser) {
        throw new GraphQLError('Not logged in', {
          extensions: {
            code: 'UNAUTHENTICATED'
          }
        })
      }

      const order = await OrderModel.findById(args.id).populate([
        { path: 'orderItems', populate: { path: 'item' } }
      ])

      logger.info(`Order: ${order}`)

      if (!order) {
        throw new GraphQLError('Order not found', {
          extensions: {
            code: 'NOT_FOUND'
          }
        })
      }

      const userObjectId = new mongoose.Types.ObjectId(context.currentUser.id)
      if (!order.user?.equals(userObjectId)) {
        throw new GraphQLError('Not authorized to see order not associated with your account', {
          extensions: {
            code: 'UNAUTHORIZED'
          }
        })
      }
      return order as Order
    }
  },
  Mutation: {
    addOrder: async (_parent: any, args: Order, context: MyContext) => {
      if (!context.currentUser) {
        throw new GraphQLError('Not authenticated', {
          extensions: {
            code: 'UNAUTHENTICATED'
          }
        })
      }

      async function confirmItemsExist(items: Order['orderItems']): Promise<number> {
        return new Promise(async (resolve) => {
          //   Validate that the total sum of the order is correct
          let totalSum = 0
          for (const item of items) {
            const itemFromDb = await ItemModel.findById(item.item as unknown as string)
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
          resolve(totalSum)
        })
      }

      const totalSum = await confirmItemsExist(args.orderItems)

      if (totalSum !== args.totalPrice) {
        throw new GraphQLError(
          `Total sum is not correct, value ${args.totalPrice} was provided, when it should have been ${totalSum}`,
          {
            extensions: {
              code: 'BAD_USER_INPUT'
            }
          }
        )
      }
      if (context.currentUser?.id !== (args.user as unknown as string)) {
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
          logger.info(`Order added: ${newOrder}`)
        })
        .catch((e) => {
          handleError(e)
          throw new GraphQLError('Order could not be added', {
            extensions: {
              code: 'INTERNAL_SERVER_ERROR'
            }
          })
        })
      return newOrder.id
    }
  }
}

export default orderResolver
