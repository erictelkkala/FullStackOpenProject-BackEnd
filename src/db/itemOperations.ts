import logger from '../utils/logger.js'
import { Item, ItemModel } from './itemSchema.js'

/**
 *
 * @remarks - Can accept any type
 * @param err - Error to be printed
 */

function handleError(err: any) {
  logger.error(err)
}

/**
 *
 * @param item - Item to be added
 * @returns An item document
 */
async function addItem(item: Item) {
  const newItem = new ItemModel(item)
  if (!newItem.listing_price) {
    newItem.listing_price = 0
  }
  if (!newItem.listing_quantity) {
    newItem.listing_quantity = 1
  }

  logger.info(`Adding item ${newItem}`)
  try {
    await newItem.save()
  } catch (err) {
    return handleError(err)
  }
  return newItem
}

/**
 *
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
 *
 * @param id - _id of the item
 */
async function findOneItem(id: string) {
  return ItemModel.findOne({ _id: { $eq: id } })
}

/**
 * @returns Array of items
 */
async function getAllItems() {
  return ItemModel.find({})
}

export { addItem, deleteItem, findOneItem, getAllItems }
