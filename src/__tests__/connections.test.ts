import request from 'supertest'
import app from '../app'

describe('GET request to', () => {
  it('/data should return 200 OK', async () => {
    const response = request(app).get('/data')
    expect((await response).status).toEqual(200)
  })
})
