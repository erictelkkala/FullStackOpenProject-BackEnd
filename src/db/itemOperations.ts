import logger from '../utils/logger.js'
import { Item, ItemModel } from './itemSchema.js'

function handleError(err: any) {
  logger.error(err)
}

async function addItem(item: Item) {
  const newItem = new ItemModel(item)
  if (!newItem.listing_price) {
    newItem.listing_price = 0
  }
  logger.info(`Adding item ${newItem}`)
  newItem.save(function (err) {
    if (err) return handleError(err)
  })
  return newItem
}

async function deleteItem(id: string) {
  try {
    ItemModel.findOneAndDelete({ _id: id })
  } catch (e) {
    logger.error(e)
    throw new Error('Item could not be found')
  }
}

async function findOneItem(id: string) {
  return ItemModel.findOne({ _id: id })
}

async function getAllItems() {
  return ItemModel.find({})
}

export { addItem, deleteItem, findOneItem, getAllItems }
