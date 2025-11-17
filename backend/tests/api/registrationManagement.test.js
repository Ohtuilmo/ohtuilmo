const { describe, test, expect, beforeEach, beforeAll, afterAll } =  require('@jest/globals')
const request = require('supertest')

const { app, server, db } = require('../../index')
const { createAndLoginAs, testUser, testAdmin } = require('../utils/login')


describe('Registration management', () => {
  test('creation should fail without permissions', async () => {
    const login = await createAndLoginAs(db, app, testUser)

    const res = await request(app)
      .post('/api/registrationManagement')
      .set('Authorization', `bearer ${login.token}`)

    expect(res.statusCode).toEqual(401)
    expect(res.body).toEqual({ 'error': 'not admin' })
  })
  test('creation should fail with missing data', async () => {
    const login = await createAndLoginAs(db, app, testAdmin)

    const res = await request(app)
      .post('/api/registrationManagement')
      .set('Authorization', `bearer ${login.token}`)

    expect(res.statusCode).toEqual(400)
    expect(res.body).toEqual({ 'error': 'All attributes must be defined' })
  })
  test.todo('should be created with correct data')

  beforeEach(async () => {
    await db.User.truncate({ cascade: true })
  })
})


beforeAll(async () => {
  await db.sequelize.truncate({ cascade: true, restartIdentity: true })
})
afterAll(async () => {
  server.close()
  // https://github.com/forwardemail/supertest/issues/520#issuecomment-1242761766
  await new Promise((res) => {
    setTimeout(res, 1)
  })
})
