import { expect } from 'chai'
import request from 'supertest'
import app from '../app.js'
import sinon from 'sinon'

// TODO: convert tests to Jest, Mocha doesn't play nice with ESNext :(

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
    it('/ should return all the items', async () => {
      const response = await request(app).get('/api/items/')
      expect(response.status).to.equal(200)
      expect(response.body).to.eql({
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
