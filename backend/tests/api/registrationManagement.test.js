const { describe, test, expect, beforeEach, beforeAll, afterAll } =  require('@jest/globals')
const request = require('supertest')

const { app, server, db } = require('../../index')
const { loginAs, adminTemplate } = require('../utils')


describe('Registration management', () => {
  test('creation should fail without permissions', async () => {
    const userId = 112233445566
    await db.User.create(adminTemplate(userId))

    const login = await loginAs(app, userId)
    const res = await request(app)
      .post('/api/registrationManagement')
      .set('Authorization', `bearer ${login.token}`)

    expect(res.statusCode).toEqual(400)
    expect(res.body).toEqual({ 'error': 'All attributes must be defined' })
  })
  test.todo('creation should fail with missing data')
  test.todo('should be created with correct data')

  beforeAll(async () => {
    await db.sequelize.truncate({ cascade: true, restartIdentity: true })
  })
  beforeEach(async () => {})
  afterAll(async () => {
    server.close()
    // https://github.com/forwardemail/supertest/issues/520#issuecomment-1242761766
    await new Promise((res) => {
      setTimeout(res, 1)
    })
  })
})
