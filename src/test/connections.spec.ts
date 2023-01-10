import { expect } from 'chai'
import request from 'supertest'

import app from '../app.js'
import { Categories, ItemType } from '../db/itemSchema.js'

describe('Request', () => {
  describe('GET', () => {
    it('/data should return 200 OK', async () => {
      const response = await request(app).get('/data')
      expect(response.status).to.equal(200)
    })
    it('/addItem should return 404', async () => {
      const response = await request(app).get('/addItem')
      expect(response.status).to.equal(404)
    })
  })
  describe('POST', () => {
    it('should be able to add an item', async () => {
      const item: ItemType = {
        listing_title: 'new_item',
        listing_description: 'new_description',
        listing_category: Categories.Sports,
        listing_price: 44,
        listing_image: 'test_image'
      }
      const response = await request(app).post('/addItem').send(item)
      expect(response.type).to.equal('application/json')
      expect(response.status).to.equal(201)
      expect(response.body).to.eql({ message: 'Item added' })
    })
  })
})
