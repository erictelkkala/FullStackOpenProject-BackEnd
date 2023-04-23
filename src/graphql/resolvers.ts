import { ItemModel } from '../db/itemSchema.js'

const resolvers = {
  Query: {
    allItems: async () => {
      return ItemModel.find({})
    }
  }
}

export default resolvers
