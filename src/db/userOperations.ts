import logger from '../utils/logger.js'
import { UserModel } from './userSchema.js'

/**
 *
 * @param user - new user with a password and a name
 * @returns A {@link User user} document
 */
async function addUser(user: { password: string; name: any }) {
  const newUser = new UserModel(user)
  logger.info(`Adding user ${newUser}`)
  await newUser
    .save()
    .then(() => {
      logger.info(`User ${newUser} added`)
      return newUser
    })
    .catch((e) => {
      logger.error(e)
    })
}

/**
 *
 * @param id - _id of the user to be deleted
 */
async function deleteUser(id: string) {
  try {
    UserModel.findByIdAndRemove(id)
    logger.info(`User with id ${id} deleted`)
  } catch (e) {
    logger.error(e)
    throw new Error('User could not be found')
  }
}

export { addUser, deleteUser }
