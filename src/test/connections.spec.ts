import { describe, expect, test } from '@jest/globals'
import request from 'supertest'

import app from '../app.js'
import { Categories, ItemModel, ItemType } from '../db/itemSchema.js'

import mongoose from 'mongoose'
import { MongoMemoryServer } from 'mongodb-memory-server'
const mongoServer = await MongoMemoryServer.create()

describe('Request', () => {
  beforeAll(async () => {
    await mongoose.connect(mongoServer.getUri(), { dbName: 'fullstack' })
  })

  afterAll(async () => {
    await mongoose.disconnect()
  })

  describe('GET', () => {
    test('/addItem should return 404', async () => {
      const response = await request(app).get('/addItem')
      expect(response.status).toBe(404)
    })
  })
  // https://jestjs.io/docs/mongodb
  // TODO: debug where the test suite hangs without --forceExit
  describe('POST', () => {
    test('should be able to add an item', async () => {
      const item: ItemType = {
        listing_title: 'new_item',
        listing_description: 'new_description',
        listing_category: Categories.Sports,
        listing_price: 44,
        listing_image: 'test_image'
      }

      // Mock the controller, so it does not send the request to the database
      app.post('/api/items/add', async (request, response) => {
        const newItem = new ItemModel(request.body)
        const ret = await newItem.save()
        response.json(ret)
      })

      const response = await request(app).post('/api/items/add').send(item)
      expect(response.type).toBe('application/json')
      expect(response.status).toBe(201)
      expect(response.body).toStrictEqual({ message: 'Item added' })
    })
  })
})
