import { Item, ItemModel } from '../db/itemSchema.js'
import logger from '../utils/logger.js'

/**
 *
 * @remarks - Can accept any type
 * @param err - Error to be printed
 */
function handleError(err: any) {
  logger.error(err)
}

const itemResolver = {
  Query: {
    /**
     * @returns Array of {@link Item items}
     */
    allItems: async () => {
      return ItemModel.find({})
    },
    /**
     *
     * @param id - id of the item
     * @returns An {@link Item item}
     */
    findItemById: async (_parent: any, args: any) => {
      return ItemModel.findById(args.id)
    }
  },
  Mutation: {
    /**
     *
     * @param item - {@link Item} to be added
     * @returns An {@link Item item} document
     */
    addItem: async (_parent: any, args: any) => {
      const newItem = new ItemModel(args as Item)
      await newItem
        .save()
        .then(() => {
          logger.info(`Item ${newItem} added`)
        })
        .catch((e) => {
          handleError(e)
        })
      return newItem
    },
    /**
     *
     * @param id - id of the item
     */
    deleteItem: async (_parent: any, args: any) => {
      await ItemModel.findByIdAndRemove(args.id)
        .then(() => {
          logger.info(`Item ${args.id} deleted`)
        })
        .catch((e) => {
          handleError(e)
        })
    }
  }
}

export default itemResolver
