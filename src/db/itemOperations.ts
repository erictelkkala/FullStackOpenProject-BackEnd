import logger from '../utils/logger.js'
import { Item, ItemModel } from './itemSchema.js'

function handleError(err: any) {
  logger.error(err)
}

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

async function deleteItem(id: string) {
  try {
    await ItemModel.findByIdAndRemove(id)
  } catch (e) {
    return handleError(e)
  }
}

async function findOneItem(id: string) {
  return ItemModel.findById(id)
}

async function getAllItems() {
  return ItemModel.find({})
}

export { addItem, deleteItem, findOneItem, getAllItems }
