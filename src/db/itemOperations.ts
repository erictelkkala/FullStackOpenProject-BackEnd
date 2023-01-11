import logger from '../utils/logger.ts'
import { Item, ItemModel } from './itemSchema.ts'

/**
 * @remarks - Can accept any type
 * @param err - Error to be printed
 */

function handleError(err: string) {
  logger.error(err)
}

/**
 * @param item - Item to be added
 * @returns An item document
 */
async function addItem(item: Item) {
  const newItem = new ItemModel(item)
  if (!newItem.listing_price) {
    newItem.listing_price = 0
  }
  logger.info(`Adding item ${newItem}`)
  try {
    await newItem.save()
  } catch (e) {
    logger.error(e)
  }
  return newItem
}

/**
 * @param id - _id of the item
 */
async function deleteItem(id: string) {
  try {
    await ItemModel.findOneAndDelete({ _id: { $eq: id } })
  } catch (e) {
    return handleError(e)
  }
}

/**
 * @param id - _id of the item
 */
async function findOneItem(id: string) {
  return await ItemModel.findOne({ _id: { $eq: id } })
}

/**
 * @returns Array of items
 */
async function getAllItems() {
  return await ItemModel.find({})
}

export { addItem, deleteItem, findOneItem, getAllItems }
