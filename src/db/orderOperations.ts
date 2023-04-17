import logger from '../utils/logger.js'
import { Order, OrderModel } from './orderSchema.js'

function handleError(err: any) {
  logger.error(err)
}

async function addOrder(order: Order) {
  const newOrder = new OrderModel(order)
  logger.info(`Adding order ${newOrder}`)
  try {
    await newOrder.save()
  } catch (err) {
    return handleError(err)
  }
  return newOrder
}

export { addOrder }
