const { describe, test, expect, beforeEach, beforeAll, afterAll } = require('@jest/globals')
const request = require('supertest')

const { app, server, db } = require('../../index')
const { loginAs, createAndLoginAs, createTestUsers, testAdmin, testUsers, resetUsers } = require('../utils/login')
const { createTestTopic, resetTopics } = require('../utils/topic')
const { createTestConfiguration, resetConfigurations } = require('../utils/configuration')
const { createTestInstructor, resetInstructor } = require('../utils/groups')


describe('POST Groups', () => {
  test('should fail with missing fields', async () => {
    const testTopicId = await createTestTopic(db)
    const testConfigurationId = await createTestConfiguration(db)
    const login = await createAndLoginAs(db, app, testAdmin)

    const resName = await request(app)
      .post('/api/groups')
      .set('Authorization', `bearer ${login.token}`)
      .send({})

    const resTopic = await request(app)
      .post('/api/groups')
      .set('Authorization', `bearer ${login.token}`)
      .send({ name: 'Hassunimi' })

    const resConfiguration = await request(app)
      .post('/api/groups')
      .set('Authorization', `bearer ${login.token}`)
      .send({ name: 'Hassunimi', topicId: testTopicId })

    const resUsers = await request(app)
      .post('/api/groups')
      .set('Authorization', `bearer ${login.token}`)
      .send({
        name: 'Hassunimi',
        topicId: testTopicId,
        configurationId: testConfigurationId
      })

    expect(resName.statusCode).toEqual(400)
    expect(Object.keys(resName.body)).toContain('error')
    expect(resName.body.error).toEqual('name is missing')

    expect(resTopic.statusCode).toEqual(400)
    expect(Object.keys(resTopic.body)).toContain('error')
    expect(resTopic.body.error).toEqual('topicId is missing')

    expect(resConfiguration.statusCode).toEqual(400)
    expect(Object.keys(resConfiguration.body)).toContain('error')
    expect(resConfiguration.body.error).toEqual('configurationId is missing')

    expect(resUsers.statusCode).toEqual(400)
    expect(Object.keys(resUsers.body)).toContain('error')
    expect(resUsers.body.error).toEqual('studentIds is missing')
  })
  test('should fail with duplicate students in group', async () => {
    const createdTestUsers = await createTestUsers(db, testUsers)
    const testTopicId = await createTestTopic(db)
    const testConfigurationId = await createTestConfiguration(db)
    const login = await createAndLoginAs(db, app, testAdmin)

    const res = await request(app)
      .post('/api/groups')
      .set('Authorization', `bearer ${login.token}`)
      .send({
        name: 'Hassunimi',
        topicId: testTopicId,
        configurationId: testConfigurationId,
        studentIds: createdTestUsers.concat(testUsers[0]).map(user => user.student_number.toString())
      })

    expect(res.statusCode).toEqual(400)
    expect(Object.keys(res.body)).toContain('error')
    expect(res.body.error).toEqual('duplicate student numbers')
  })
  test('should fail with incorrect student numbers', async () => {
    const createdTestUsers = await createTestUsers(db, testUsers)
    const testTopicId = await createTestTopic(db)
    const testConfigurationId = await createTestConfiguration(db)
    const login = await createAndLoginAs(db, app, testAdmin)

    const res = await request(app)
      .post('/api/groups')
      .set('Authorization', `bearer ${login.token}`)
      .send({
        name: 'Hassunimi',
        topicId: testTopicId,
        configurationId: testConfigurationId,
        studentIds: createdTestUsers.map(user => user.student_number.toString()).concat('eiainakaansn')
      })

    expect(res.statusCode).toEqual(400)
    expect(Object.keys(res.body)).toContain('error')
    expect(res.body.error).toEqual('Student "eiainakaansn" does not exist')
  })
  test('should be created with valid data', async () => {
    const createdTestUsers = await createTestUsers(db, testUsers)
    const testTopicId = await createTestTopic(db)
    const testConfigurationId = await createTestConfiguration(db)
    const login = await createAndLoginAs(db, app, testAdmin)

    const res = await request(app)
      .post('/api/groups')
      .set('Authorization', `bearer ${login.token}`)
      .send({
        name: 'Hassunimi',
        topicId: testTopicId,
        configurationId: testConfigurationId,
        studentIds: createdTestUsers.map(user => user.student_number.toString())
      })

    expect(res.statusCode).toEqual(200)
    expect(Object.keys(res.body)).toContain(
      'id',
      'name',
      'createdAt',
      'updatedAt',
      'topicId',
      'instructorId',
      'configurationId',
    )
  })


  beforeEach(async () => {
    await resetUsers(db)
    await resetTopics(db)
    await resetConfigurations(db)
    await db.Group.truncate({ cascade: true, restartIdentity: true })
  })
})

describe('GET /api/groups', () => {
  test('should fail as non-logined user or as a student', async () => {
    const login = await createAndLoginAs(db, app, testUsers[0])

    const resNonLogin = await request(app)
      .get('/api/groups')

    const resUser = await request(app)
      .get('/api/groups')
      .set('Authorization', `bearer ${login.token}`)

    expect(resNonLogin.statusCode).toEqual(401)
    expect(resNonLogin.body).toEqual({ error: 'token missing or invalid' })

    expect(resUser.statusCode).toEqual(401)
    expect(resUser.body).toEqual({ error: 'not instructor' })
  })
  test('should succeed as an instructor or admin', async () => {
    const instructorSN = await createTestInstructor(db)

    const loginInstructor = await loginAs(app, instructorSN)
    const loginAdmin = await createAndLoginAs(db, app, testAdmin)

    const resInstructor = await request(app)
      .get('/api/groups')
      .set('Authorization', `bearer ${loginInstructor.token}`)
    const resAdmin = await request(app)
      .get('/api/groups')
      .set('Authorization', `bearer ${loginAdmin.token}`)

    expect(resInstructor.statusCode).toEqual(200)
    expect(resInstructor.body).not.toHaveLength(0)

    expect(resAdmin.statusCode).toEqual(200)
    expect(resAdmin.body).not.toHaveLength(0)
  })


  beforeEach(async () => {
    await resetUsers(db)
    await resetInstructor(db)
    await db.Group.truncate({ cascade: true, restartIdentity: true })
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
