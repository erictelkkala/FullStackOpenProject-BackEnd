import { Request } from 'express'
import { UserModel } from './userSchema.js'
import logger from '../utils/logger.js'

async function addUser(request: Request) {
  const user = new UserModel(request.body)
  logger.info(`Adding user ${user}`)
  await user.save()
  return user
}

export { addUser }
