import { Request } from 'express'

async function addUser(request: Request) {
  console.log(request)
}

export { addUser }
