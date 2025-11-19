const { describe, test, expect, beforeEach, beforeAll, afterAll } =  require('@jest/globals')
const request = require('supertest')

const { app, server, db } = require('../../index')
const { createAndLoginAs, createTestUsers, testAdmin, testUsers } = require('../utils/login')
const { createTestTopic } = require('../utils/topic')
const { createTestConfiguration } = require('../utils/configuration')


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
    await db.User.truncate({ cascade: true })
    await db.Topic.truncate({ cascade: true })
    await db.RegistrationManagement.truncate({ cascade: true, restartIdentity: true  })
    await db.Configuration.truncate({ cascade: true })
    await db.RegistrationQuestionSet.truncate({ cascade: true })
    await db.Group.truncate({ cascade: true })
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
