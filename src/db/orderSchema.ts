import mongoose, { InferSchemaType, Types } from 'mongoose'

interface OrderInterface {
  user: {
    id: Types.ObjectId
    name: string
  }
  orderItems: {
    id: Types.ObjectId
    quantity: number
  }[]
  shippingAddress: {
    address: string
    city: string
    postalCode: string
    country: string
  }
  paymentMethod: string
  paymentResult: {
    id: string
    paymentStatus: string
    paymentTime: string
  }
  totalPrice: number
}

const orderSchema = new mongoose.Schema<OrderInterface>(
  {
    user: {
      type: Types.ObjectId,
      ref: 'User',
      required: true
    } as const,
    orderItems: [
      {
        _id: {
          type: Types.ObjectId,
          ref: 'Item',
          required: true
        },
        quantity: { type: Number, required: true, min: 1, max: 100 }
      } as const
    ],
    shippingAddress: {
      address: { type: String, required: true },
      city: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, required: true }
    } as const,
    paymentMethod: {
      type: String,
      required: true
    } as const,
    paymentResult: {
      id: { type: String, required: true },
      paymentStatus: { type: String, required: true },
      paymentTime: { type: String, required: true }
    } as const,
    totalPrice: {
      type: Number,
      required: true,
      default: 0.0,
      min: 0,
      max: 1000000
    } as const
  },
  { timestamps: true }
)

orderSchema.set('toObject', {
  transform: (_document, returned) => {
    returned.id = returned._id
    delete returned._id
    delete returned.__v
  }
})

export type Order = InferSchemaType<typeof orderSchema>
export const OrderModel = mongoose.model('Order', orderSchema)
