import argon2 from 'argon2'
import mongoose, { InferSchemaType, Schema } from 'mongoose'

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      min: [4, 'Username needs to be at least 4 characters long'],
      max: [128, 'Username cannot exceed 128 characters']
    },
    password: {
      type: String,
      required: true,
      min: [4, 'Password needs to be at least 4 characters long'],
      max: [128, 'Password cannot exceed 128 characters']
    }
  },
  {
    timestamps: true
  }
)

// Delete and modify unwanted fields from the response
userSchema.set('toJSON', {
  transform: (_document, returned) => {
    returned.id = returned._id
    delete returned._id
    delete returned.__v
    delete returned.password
  }
})

// Pre-hook to hash the password before saving
userSchema.pre('save', async function (next) {
  const user = this
  const hash = await argon2.hash(user.password)
  this.password = hash as string
  next()
})

export type User = InferSchemaType<typeof userSchema>
export const UserModel = mongoose.model('User', userSchema)
