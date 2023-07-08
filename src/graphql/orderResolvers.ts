import { GraphQLError } from 'graphql'

import { MyContext } from '../app.js'
import { ItemModel } from '../db/itemSchema.js'
import { Order, OrderModel } from '../db/orderSchema.js'
import logger from '../utils/logger.js'

function handleError(err: any) {
  logger.error(err)
}

const orderResolver = {
  Query: {
    allOrders: async (context: MyContext) => {
      if (!context.currentUser) {
        throw new GraphQLError('Not authenticated', {
          extensions: {
            code: 'UNAUTHENTICATED'
          }
        })
      }
      // TODO: Find out why categories field is not getting populated
      return OrderModel.find({}).populate('orderItems').populate('user')
    },
    getAllOrdersByUser: async (_parent: any, _args: any, context: MyContext) => {
      if (!context.currentUser) {
        throw new GraphQLError('Not authenticated', {
          extensions: {
            code: 'UNAUTHENTICATED'
          }
        })
      }

      return OrderModel.find({ user: context.currentUser.id })
        .populate('orderItems')
        .populate('user')
    },
    getOrder: async (_parent: any, args: any, context: MyContext) => {
      if (!context.currentUser) {
        throw new GraphQLError('Not authenticated or logged in', {
          extensions: {
            code: 'UNAUTHENTICATED'
          }
        })
      }

      const order = await OrderModel.findById(args.id).populate([
        { path: 'orderItems', populate: { path: 'item', model: ItemModel } },
        'user'
      ])
      console.log(order)
      if (!order) {
        throw new GraphQLError('Order not found', {
          extensions: {
            code: 'NOT_FOUND'
          }
        })
      }
      if ((order.user.id as unknown as string) !== context.currentUser.id) {
        throw new GraphQLError('Not authorized to see order not associated with your account', {
          extensions: {
            code: 'UNAUTHORIZED'
          }
        })
      }
      return order
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

      async function confirmItemsExist(items: { id: any; quantity: number }[]): Promise<number> {
        return new Promise(async (resolve) => {
          //   Validate that the total sum of the order is correct
          let totalSum = 0
          for (const item of items) {
            const itemFromDb = await ItemModel.findById(item.id as string)
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
