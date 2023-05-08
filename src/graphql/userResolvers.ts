import * as argon2 from 'argon2'
import { GraphQLError } from 'graphql'
import jwt from 'jsonwebtoken'

import { UserModel } from '../db/userSchema.js'
import logger from '../utils/logger.js'

function handleError(err: any) {
  logger.error(err)
}

const userResolver = {
  Query: {
    getUser: async (_parent: any, args: any) => {
      return UserModel.findById(args.id)
    },
    me: async (_parent: any, _args: any, context: any) => {
      if (!context.user) {
        throw new GraphQLError('Not authenticated', {
          extensions: {
            code: 'UNAUTHENTICATED'
          }
        })
      }
      return context.user
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
     * @param id - id of the user to be deleted
     */
    deleteUser: async (_parent: any, args: { id: string }, context: any) => {
      if (!context.user) {
        throw new GraphQLError('Not authenticated', {
          extensions: {
            code: 'UNAUTHENTICATED'
          }
        })
      }
      UserModel.findByIdAndRemove(args.id)
        .then(() => {
          logger.info(`User with id ${args.id} deleted`)
        })
        .catch((e) => {
          logger.error(e)
          throw new GraphQLError('User not found', {
            extensions: {
              code: 'USER_NOT_FOUND'
            }
          })
        })
    },
    login: async (_parent: any, args: { password: string; name: string }) => {
      const user = await UserModel.findOne({ name: args.name })

      console.log(user)

      if (!user) {
        throw new GraphQLError('User not found', {
          extensions: {
            code: 'USER_NOT_FOUND'
          }
        })
      }

      const valid = await argon2.verify(user.password, args.password)

      if (!valid) {
        throw new GraphQLError('Invalid password', {
          extensions: {
            code: 'INVALID_PASSWORD'
          }
        })
      }

      const token = { name: user.name, id: user.id }

      return {
        token: jwt.sign(token, process.env.JWT_SECRET as string, {
          expiresIn: '1d',
          algorithm: 'HS512'
        })
      }
    }
  }
}

export default userResolver
