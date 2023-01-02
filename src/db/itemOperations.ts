import { Request } from 'express'

import logger from '../utils/logger.js'
import { ItemModel } from './itemSchema.js'

function handleError(err: any) {
  logger.error(err)
}

async function addItem(request: Request) {
  const item = new ItemModel(request.body)
  logger.info(`Adding item ${item}`)
  item.save(function (err) {
    if (err) return handleError(err)
  })
  return item
}

async function getAllItems() {
  const items = await ItemModel.find({})
  return items
}

export { addItem, getAllItems }
