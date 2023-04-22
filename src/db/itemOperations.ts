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
 * @param item - {@link Item} to be added
 * @returns An {@link Item item} document
 */
async function addItem(item: Item) {
  const newItem = new ItemModel(item)

  await newItem
    .save()
    .then(() => {
      logger.info(`Item ${newItem} added`)
    })
    .catch((e) => {
      handleError(e)
    })

  return newItem
}

/**
 *
 * @param id - _id of the item
 */
async function deleteItem(id: string) {
  try {
    await ItemModel.findByIdAndRemove(id)
  } catch (e) {
    return handleError(e)
  }
}

/**
 *
 * @param id - _id of the item
 */
async function findOneItem(id: string) {
  return ItemModel.findById(id)
}

/**
 * @returns Array of {@link Item items}
 */
async function getAllItems() {
  return ItemModel.find({})
}

export { addItem, deleteItem, findOneItem, getAllItems }
