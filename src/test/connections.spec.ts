import { describe, expect, jest, test } from '@jest/globals'
import request from 'supertest'

import app from '../app.js'
import { Categories, ItemType } from '../db/itemSchema.js'

describe('Request', () => {
  describe('GET', () => {
    test('/addItem should return 404', async () => {
      const response = await request(app).get('/addItem')
      expect(response.status).toBe(404)
    })
  })
  // TODO: make the app use a test database
  // https://jestjs.io/docs/mongodb
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
      jest.mock('../controllers/item', () => {
        Promise.resolve({ status: 200 })
      })

      const response = await request(app).post('/api/items/add').send(item)
      expect(response.type).toBe('application/json')
      expect(response.status).toBe(201)
      expect(response.body).toStrictEqual({ message: 'Item added' })
    })
  })
})
