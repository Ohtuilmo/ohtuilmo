const { describe, test, expect, beforeEach, beforeAll, afterAll } =  require('@jest/globals')
const request = require('supertest')

const { app, server, db } = require('../../index')
const { createAndLoginAs, testUser, testAdmin, resetUsers } = require('../utils/login')
const { createTestConfiguration, resetConfigurations } = require('../utils/configuration')
const { testRegistrationManagement, resetRegistrationManagements } = require('../utils/registrationManagement')


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
    await createTestConfiguration(db)

    const res = await request(app)
      .post('/api/registrationManagement')
      .set('Authorization', `bearer ${login.token}`)

    expect(res.statusCode).toEqual(400)
    expect(res.body).toEqual({ 'error': 'All attributes must be defined' })
  })
  test('creation should fail with incorrect peer_review_round', async () => {
    const login = await createAndLoginAs(db, app, testAdmin)
    await createTestConfiguration(db)

    // deep copy
    const testRegManCopy = JSON.parse(JSON.stringify(testRegistrationManagement))
    testRegManCopy.peer_review_round = 4

    const res = await request(app)
      .post('/api/registrationManagement')
      .set('Authorization', `bearer ${login.token}`)
      .send({ registrationManagement: testRegManCopy })

    expect(res.statusCode).toEqual(400)
    expect(Object.keys(res.body)).toContain('error')
    expect(res.body.error).toEqual('Peer review round should be either 1 or 2')
  })
  test('creation should fail with missing messages when registration closed', async () => {
    const login = await createAndLoginAs(db, app, testAdmin)
    await createTestConfiguration(db)

    // deep copy
    const testRegManCopyProject = JSON.parse(JSON.stringify(testRegistrationManagement))
    const testRegManCopyTopic = JSON.parse(JSON.stringify(testRegistrationManagement))

    testRegManCopyProject.project_registration_open = 0
    testRegManCopyProject.project_registration_message = ''

    testRegManCopyTopic.topic_registration_open = 0
    testRegManCopyTopic.topic_registration_message = ''

    const resProject = await request(app)
      .post('/api/registrationManagement')
      .set('Authorization', `bearer ${login.token}`)
      .send({ registrationManagement: testRegManCopyProject })

    const resTopic = await request(app)
      .post('/api/registrationManagement')
      .set('Authorization', `bearer ${login.token}`)
      .send({ registrationManagement: testRegManCopyTopic })

    expect(resProject.statusCode).toEqual(400)
    expect(Object.keys(resProject.body)).toContain('error')
    expect(resProject.body.error).toEqual('Message must be provided when project registration is closed')

    expect(resTopic.statusCode).toEqual(400)
    expect(Object.keys(resTopic.body)).toContain('error')
    expect(resTopic.body.error).toEqual('Message must be provided when topic registration is closed')
  })
  test('creation should fail with missing configurations', async () => {
    const login = await createAndLoginAs(db, app, testAdmin)

    const res = await request(app)
      .post('/api/registrationManagement')
      .set('Authorization', `bearer ${login.token}`)
      .send({ registrationManagement: testRegistrationManagement })

    expect(res.statusCode).toEqual(400)
    expect(Object.keys(res.body)).toContain('error')
    expect(res.body.error).toEqual('Provided configuration for project registration does not exist')
  })
  test('should be created with correct data', async () => {
    const login = await createAndLoginAs(db, app, testAdmin)
    await createTestConfiguration(db)

    const res = await request(app)
      .post('/api/registrationManagement')
      .set('Authorization', `bearer ${login.token}`)
      .send({ registrationManagement: testRegistrationManagement })

    expect(res.statusCode).toEqual(201)
  })

  beforeEach(async () => {
    await resetUsers(db)
    await resetConfigurations(db)
    await resetRegistrationManagements(db)
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
