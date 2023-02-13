import { describe, expect, test } from '@jest/globals'
import request from 'supertest'
import app from '../app.js'
import sinon from 'sinon'

const stub = sinon.stub(app, 'get')
stub.resolves({
  status: 200,
  item: {
    listing_title: 'mock_title',
    listing_description: 'mock_description',
    listing_price: 2,
    listing_image: 'null.png',
    listing_category: 'Home'
  }
})
describe('Item', () => {
  describe('GET', () => {
    test('/should return all the items', async () => {
      const response = await request(app).get('/api/items/')
      expect(response.status).toBe(200)
      expect(response.body).toBe({
        item: {
          listing_title: 'mock_title',
          listing_description: 'mock_description',
          listing_price: 2,
          listing_image: 'null.png',
          listing_category: 'Home'
        }
      })
    })
  })
})
