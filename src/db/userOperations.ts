import { Request } from 'express'

import logger from '../utils/logger.js'
import { UserModel } from './userSchema.js'

async function addUser(request: Request) {
  const user = new UserModel(request.body)
  logger.info(`Adding user ${user}`)
  await user.save()
  return user
}

export { addUser }
