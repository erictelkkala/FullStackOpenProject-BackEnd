import request from 'supertest'
import { expect } from 'chai'
import app from '../app'

describe('Request', () => {
  describe('GET', () => {
    it('/data should return 200 OK', async () => {
      const response = await request(app).get('/data')
      expect(response.status).to.equal(200)
    })
  })
})
