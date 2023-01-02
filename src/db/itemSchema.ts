import mongoose, { Schema, InferSchemaType } from 'mongoose'

export enum Categories {
  Electronics = 'Electronics',
  Home = 'Home',
  Clothing = 'Clothing',
  Toys = 'Toys',
  Books = 'Books',
  Sports = 'Sports',
  Tools = 'Tools',
  Other = 'Other'
}

const itemSchema = new Schema(
  {
    listing_title: { type: String, required: true },
    listing_description: { type: String, required: true },
    listing_price: {
      type: Number,
      required: false,
      default: 0,
      min: [0, 'The price cannot be negative'],
      max: [1000000, 'The price cannot be more than 1 million']
    },
    listing_image: { type: String, required: true },
    listing_category: {
      type: String,
      enum: {
        values: ['Electronics', 'Home', 'Clothing', 'Toys', 'Books', 'Sports', 'Tools', 'Other'],
        message:
          'The category must be one of the following: Electronics, Home, Clothing, Toys, Books, Sports, Tools, Other'
      },
      default: 'Other',
      required: true
    }
  },
  {
    timestamps: true
  }
)

// Delete and modify unwanted fields from the response
itemSchema.set('toJSON', {
  transform: (_document, returned) => {
    returned.id = returned._id
    delete returned._id
    delete returned.__v
  }
})

export type Item = InferSchemaType<typeof itemSchema>
export const ItemModel = mongoose.model('Item', itemSchema)
