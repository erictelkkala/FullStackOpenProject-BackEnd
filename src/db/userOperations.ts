import logger from '../utils/logger.ts'
import { UserModel } from './userSchema.ts'

/**
 * @param user - new user with a password and a name
 */
async function addUser(user: { password: string; name: string }) {
  const newUser = new UserModel(user)
  logger.info(`Adding user ${newUser}`)
  await newUser.save()
  return newUser
}

/**
 * @param id - _id of the user to be deleted
 */
async function deleteUser(id: string) {
  try {
    await UserModel.findOneAndDelete({ _id: { $eq: id } })
  } catch (e) {
    logger.error(e)
    throw new Error('User could not be found')
  }
}

export { addUser, deleteUser }
