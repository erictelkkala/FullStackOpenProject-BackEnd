import logger from '../utils/logger.js'
import { UserModel } from './userSchema.js'

/**
 *
 * @param user - new user with a password and a name
 */
async function addUser(user: { password: string; name: any }) {
  const newUser = new UserModel(user)
  logger.info(`Adding user ${newUser}`)
  await newUser.save()
  return newUser
}

/**
 *
 * @param id - _id of the user to be deleted
 */
async function deleteUser(id: string) {
  try {
    UserModel.findOneAndDelete({ _id: id })
  } catch (e) {
    logger.error(e)
    throw new Error('User could not be found')
  }
}

export { addUser, deleteUser }
