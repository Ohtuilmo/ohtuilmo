const { describe, test, expect, beforeEach, beforeAll, afterAll } =  require('@jest/globals')
const request = require('supertest')

const { app, server, db } = require('../../index')
const { loginAs, createAndLoginAs, testAdmin, testUsers } = require('../utils/login')
const { createTestGroup } = require('../utils/groups')

const testSprint = {
  start_date: null,
  end_date: null,
  sprint: null,
  group_id: null
}

describe('Sprints', () => {
  test.skip('should not be created with user without a group', async () => {
    const login = await loginAs(app, testUsers[2].student_number)
    await createTestGroup(db, testUsers)

    const res = await request(app)
      .post('/api/sprints')
      .set('Authorization', `bearer ${login.token}`)
      .send({ user_id: testUsers[2].student_number })

    expect(res.statusCode).toEqual(500)
    expect(Object.keys(res.body)).toContain('error')
    expect(res.body.error).toEqual('User does not belong to any group or not found.')
  })
  test.todo('should not be created with incorrect dates')
  test.todo('should be created with correct data')

  beforeEach(async () => {
    await db.Group.truncate({ cascade: true })
    await db.Topic.truncate({ cascade: true })
    await db.Configuration.truncate({ cascade: true })
    await db.User.truncate({ cascade: true })
  })
})

describe('PUT /api/sprints', () => {
  test('should fail with missing fields', async () => {
    const login = await createAndLoginAs(db, app, testAdmin)

    // const sprint =

    const res = await request(app)
      .put('/api/sprints/1')
      .set('Authorization', `bearer ${login.token}`)

    const resSprint = await request(app)
      .put('/api/sprints/1')
      .set('Authorization', `bearer ${login.token}`)
      .send(testSprint)

    expect(resSprint)

    expect(res.statusCode).toEqual(404)
    expect(Object.keys(res.body)).toContain('error')
  })
  test.todo('should fail with dates where start > end')
  test.todo('should fail with dates overlapping with other sprints')
  test.todo('should fail with if the sprint\'s order changes')
  test.todo('should warn with long gaps between sprints')

  beforeEach(async () => {
    await db.Group.truncate({ cascade: true })
    await db.Topic.truncate({ cascade: true })
    await db.Configuration.truncate({ cascade: true })
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
