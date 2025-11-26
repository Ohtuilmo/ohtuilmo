const { describe, test, expect, beforeEach, beforeAll, afterAll } =  require('@jest/globals')
const request = require('supertest')

const { app, server, db } = require('../../index')
const { loginAs, resetUsers, testAdmin, testUsers } = require('../utils/login')
const { createTestGroup, resetGroups } = require('../utils/groups')
const { createTestSprint, resetSprints } = require('../utils/sprints')

const testSprint = {
  start_date: null,
  end_date: null,
  sprint: null,
  group_id: null
}

describe('Sprints', () => {
  test('should not be created with user without a group', async () => {
    const login = await loginAs(app, testUsers[2].student_number)
    await createTestGroup(db, [testUsers[0], testUsers[1]])

    const res = await request(app)
      .post('/api/sprints')
      .set('Authorization', `bearer ${login.token}`)
      .send({ user_id: testUsers[2].student_number })

    expect(res.statusCode).toEqual(500)
    expect(Object.keys(res.body)).toContain('error')
    expect(res.body.error).toEqual('Error creating sprint: User does not belong to any group or not found.')
  })
  test('should not be created with incorrect dates', async () => {
    await createTestGroup(db)
    const login = await loginAs(app, testUsers[0].student_number)

    const testSprintStartGreEnd = {
      sprint: 3,
      start_date: new Date(10),
      end_date: new Date(5),
      user_id: login.user.student_number
    }
    const testSprintInvalidDates = {
      sprint: 3,
      start_date: 'hi',
      end_date: -123049,
      user_id: login.user.student_number
    }

    const resStartGreEnd = await request(app)
      .post('/api/sprints')
      .set('Authorization', `bearer ${login.token}`)
      .send(testSprintStartGreEnd)

    const resInvalidDates = await request(app)
      .post('/api/sprints')
      .set('Authorization', `bearer ${login.token}`)
      .send(testSprintInvalidDates)

    expect(resStartGreEnd.statusCode).toEqual(400)
    expect(Object.keys(resStartGreEnd.body)).toContain('error')
    expect(resStartGreEnd.body.error).toEqual('Error validating sprint: Start date must be before end date.')

    expect(resInvalidDates.statusCode).toEqual(400)
    expect(Object.keys(resInvalidDates.body)).toContain('error')
    expect(resInvalidDates.body.error).toEqual('Error validating sprint: Start date or end date is invalid.')

  })
  test('should not be created with invalid sprint', async () => {
    await createTestGroup(db)
    const login = await loginAs(app, testUsers[0].student_number)

    const testSprintInvalidSprint = {
      sprint: 'kolme',
      start_date: new Date(5),
      end_date: new Date(10),
      user_id: login.user.student_number
    }

    const resInvalidSprint = await request(app)
      .post('/api/sprints')
      .set('Authorization', `bearer ${login.token}`)
      .send(testSprintInvalidSprint)

    expect(resInvalidSprint.statusCode).toEqual(400)
    expect(Object.keys(resInvalidSprint.body)).toContain('error')
    expect(resInvalidSprint.body.error).toEqual('Error validating sprint: Sprint must be a valid number.')
  })
  test('should be created with correct data', async () => {
    await createTestGroup(db)
    const login = await loginAs(app, testUsers[0].student_number)

    const testSprint = {
      sprint: 1,
      start_date: new Date(5),
      end_date: new Date(10),
      user_id: login.user.student_number
    }

    const res = await request(app)
      .post('/api/sprints')
      .set('Authorization', `bearer ${login.token}`)
      .send(testSprint)

    expect(res.statusCode).toEqual(201)
    expect(Object.keys(res.body[0])).toContain('id', 'start_date', 'end_date', 'sprint')
    expect(res.body[0].sprint).toEqual(1)
  })

  beforeEach(async () => {
    await resetUsers(db)
    await resetGroups(db)
    await resetSprints(db)
  })
})


describe('GET /api/sprints', () => {
  test('should fail without any permissions', async () => {
    const res = await request(app)
      .get('/api/sprints')

    expect(res.statusCode).toEqual(401)
    expect(Object.keys(res.body)).toContain('error')
    expect(res.body.error).toEqual('token missing or invalid')
  })
  test('should return only user\'s sprints when loggen in as an user', async () => {
    const groupId = await createTestGroup(db)
    await createTestSprint(db, groupId)

    const login = await loginAs(app, testUsers[0].student_number)

    const res = await request(app)
      .get('/api/sprints')
      .set('Authorization', `bearer ${login.token}`)

    expect(res.statusCode).toEqual(200)
    expect(res.body).not.toHaveLength(0)
    expect(Object.keys(res.body[0])).toContain('start_date', 'end_date', 'sprint', 'group_id')
  })
  test('should not return anything for user not in the group with sprints', async () => {
    const login = await loginAs(app, testUsers[2].student_number)

    const res = await request(app)
      .get('/api/sprints')
      .set('Authorization', `bearer ${login.token}`)

    expect(res.statusCode).toEqual(500)
    expect(Object.keys(res.body)).toContain('error')
    expect(res.body.error).toContain('Error fetching sprints: ')
  })

  beforeEach(async () => {
    await resetUsers(db)
    await resetGroups(db)
    await resetSprints(db)
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
    await resetUsers(db)
    await resetGroups(db)
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
