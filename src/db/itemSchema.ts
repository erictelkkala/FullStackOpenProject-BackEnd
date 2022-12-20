import mongoose, { Schema, InferSchemaType } from 'mongoose'

const itemSchema = new Schema(
  {
    listing_title: { type: String, required: true },
    listing_description: { type: String, required: true },
    listing_price: { type: Number, required: false },
    listing_image: { type: String, required: true }
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
