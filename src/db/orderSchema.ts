import mongoose, { InferSchemaType } from 'mongoose'

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    orderItems: [
      {
        name: { type: String, required: true },
        quantity: { type: Number, required: true, min: 1, max: 100 },
        price: { type: Number, required: true, min: 0, max: 1000000 }
      }
    ],
    shippingAddress: {
      address: { type: String, required: true },
      city: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, required: true }
    },
    paymentMethod: {
      type: String,
      required: true
    },
    paymentResult: {
      id: { type: String, required: true },
      paymentStatus: { type: String, required: true },
      paymentTime: { type: String, required: true }
    },
    totalPrice: {
      type: Number,
      required: true,
      default: 0.0,
      min: 0,
      max: 1000000
    }
  },
  { timestamps: true }
)

orderSchema.set('toJSON', {
  transform: (_document, returned) => {
    returned.id = returned._id
    delete returned._id
    delete returned.__v
  }
})

export type Order = InferSchemaType<typeof orderSchema>
export const OrderModel = mongoose.model('Order', orderSchema)
