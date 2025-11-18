const { describe, test, expect, beforeEach, beforeAll, afterAll } =  require('@jest/globals')
const request = require('supertest')

const { app, server, db } = require('../../index')
const { createAndLoginAs, testAdmin } = require('../utils/login')
const { createTestRegistrationManagement } = require('../utils/registrationManagement')
const { testContent } = require('../utils/topic')


describe('Topics', () => {
  test('should not be created with missing registration management open', async () => {
    const login = await createAndLoginAs(db, app, testAdmin)

    const res = await request(app)
      .post('/api/topics')
      .set('Authorization', `bearer ${login.token}`)
      .send({ testContent, configuration_id: 1 })

    expect(res.statusCode).toEqual(400)
    expect(Object.keys(res.body)).toContain('error')
    expect(res.body.error).toEqual('topic registration is not currently open')
  })
  test('should not be created with missing data', async () => {
    const login = await createAndLoginAs(db, app, testAdmin)
    await createTestRegistrationManagement(db)

    const resContent = await request(app)
      .post('/api/topics')
      .set('Authorization', `bearer ${login.token}`)
      .send({ configuration_id: '' })

    const resConfigurationId = await request(app)
      .post('/api/topics')
      .set('Authorization', `bearer ${login.token}`)
      .send({ content: testContent, configuration_id: '' })

    expect(resConfigurationId.statusCode).toEqual(400)
    expect(Object.keys(resConfigurationId.body)).toContain('error')
    expect(resConfigurationId.body.error).toEqual('Topic must be associated with configuration')

    expect(resContent.statusCode).toEqual(400)
    expect(Object.keys(resContent.body)).toContain('error')
    expect(resContent.body.error).toEqual('content undefined')
  })
  test('should be created with correct data', async () => {
    const login = await createAndLoginAs(db, app, testAdmin)
    await createTestRegistrationManagement(db)
    const configuration_id = (await db.Configuration.findAll({}))[0].id

    const res = await request(app)
      .post('/api/topics')
      .set('Authorization', `bearer ${login.token}`)
      .send({ content: testContent, configuration_id })

    expect(res.statusCode).toEqual(200)
  })


  beforeEach(async () => {
    await db.User.truncate({ cascade: true })
    await db.Topic.truncate({ cascade: true })
    await db.RegistrationManagement.truncate({ cascade: true, restartIdentity: true  })
    await db.Configuration.truncate({ cascade: true })
    await db.RegistrationQuestionSet.truncate({ cascade: true })
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
