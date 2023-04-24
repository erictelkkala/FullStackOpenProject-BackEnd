import * as argon2 from 'argon2'
import jwt from 'jsonwebtoken'

import { UserModel } from '../db/userSchema.js'
import logger from '../utils/logger.js'

function handleError(err: any) {
  logger.error(err)
}

const userResolver = {
  Query: {
    findUserById: async (_parent: any, args: any) => {
      return UserModel.findById(args.id)
    }
  },
  Mutation: {
    /**
     *
     * @param user - new user with a password and a name
     * @returns A {@link User user}
     */
    addUser: async (_parent: any, args: { password: string; name: string }) => {
      const newUser = new UserModel(args)
      await newUser
        .save()
        .then(() => {
          logger.info(`User ${newUser} added`)
        })
        .catch((e) => {
          handleError(e)
        })
      return newUser
    },
    /**
     *
     * @param id - _id of the user to be deleted
     */
    deleteUser: async (_parent: any, args: { id: string }, context: any) => {
      if (!context.user) {
        throw new Error('Not authenticated')
      }
      UserModel.findByIdAndRemove(args.id)
        .then(() => {
          logger.info(`User with id ${args.id} deleted`)
        })
        .catch((e) => {
          logger.error(e)
          throw new Error('User could not be found')
        })
    },
    login: async (_parent: any, args: { password: string; name: string }) => {
      const user = await UserModel.findOne({ name: args.name })
      if (!user) {
        throw new Error('User not found')
      }

      const valid = await argon2.verify(args.password, user.password)
      if (!valid) {
        throw new Error('Invalid password')
      }

      const token = { name: user.name, id: user.id }

      return jwt.sign(token, process.env.JWT_SECRET as string, {
        expiresIn: '1d',
        algorithm: 'HS512'
      })
    }
  }
}

export default userResolver
