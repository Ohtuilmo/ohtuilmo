const { describe, test, expect, beforeEach, beforeAll, afterAll } =  require('@jest/globals')
const request = require('supertest')

const { app, server, db } = require('../../index')
const { loginAs, createTestUser, resetUsers, testAdmin, testUsers } = require('../utils/login')
const { createTestGroup, resetGroups } = require('../utils/groups')
const { createTestSprint, resetSprints, testSprint } = require('../utils/sprints')

const nullTestSprint = {
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
  // initialized in beforeEach
  let groupId = 0
  let sprintId1 = 0

  test('should fail with missing fields', async () => {
    const login = await loginAs(app, testAdmin.student_number)

    const res = await request(app)
      .put('/api/sprints/1')
      .set('Authorization', `bearer ${login.token}`)

    const resSprint = await request(app)
      .put('/api/sprints/1')
      .set('Authorization', `bearer ${login.token}`)
      .send(nullTestSprint)

    expect(res.statusCode).toEqual(500)
    expect(Object.keys(res.body)).toContain('error')
    expect(res.body.error).toEqual('Error updating sprint: Start date or end date is invalid.')

    expect(resSprint.statusCode).toEqual(500)
    expect(Object.keys(resSprint.body)).toContain('error')
    expect(resSprint.body.error).toEqual('Error updating sprint: Start date or end date is invalid.')

    // check that sprint has not been updated
    const updatedSprint1 = await db.Sprint.findOne({ where: { id: sprintId1 } })
    expect(new Date(updatedSprint1.start_date)).toEqual(testSprint.start_date)
    expect(new Date(updatedSprint1.end_date)).toEqual(testSprint.end_date)
  })
  test('should fail with dates where start > end', async () => {
    const login = await loginAs(app, testAdmin.student_number)

    const newSprintDates = {
      sprint: 1,
      group_id: groupId,
      start_date: new Date(10),
      end_date: new Date(5),
    }

    const res = await request(app)
      .put('/api/sprints/1')
      .set('Authorization', `bearer ${login.token}`)
      .send(newSprintDates)

    expect(res.statusCode).toEqual(500)
    expect(Object.keys(res.body)).toContain('error')
    expect(res.body.error).toEqual('Error updating sprint: Start date must be before end date.')

    // check that sprint has not been updated
    const updatedSprint = await db.Sprint.findOne({ where: { id: sprintId1 } })
    expect(new Date(updatedSprint.start_date)).toEqual(testSprint.start_date)
    expect(new Date(updatedSprint.end_date)).toEqual(testSprint.end_date)
  })
  test('should fail with dates overlapping with other sprints', async () => {
    const testSprint2 = {
      sprint: 2,
      start_date: new Date(10),
      end_date: new Date(20),
      created_at: new Date(),
      updated_at: new Date(),
      group_id: groupId
    }
    const sprintId2 = (await db.Sprint.create(testSprint2)).id

    const login = await loginAs(app, testAdmin.student_number)

    const overlappingSprintEndDate = {
      sprint: 1,
      group_id: groupId,
      start_date: new Date(0),
      end_date: new Date(13)
    }

    const overlappingSprintStartDate = {
      sprint: 2,
      group_id: groupId,
      start_date: new Date(7),
      end_date: new Date(20)
    }

    const resEnd = await request(app)
      .put('/api/sprints/1')
      .set('Authorization', `bearer ${login.token}`)
      .send(overlappingSprintEndDate)

    const resStart = await request(app)
      .put('/api/sprints/2')
      .set('Authorization', `bearer ${login.token}`)
      .send(overlappingSprintStartDate)

    expect(resEnd.statusCode).toEqual(500)
    expect(Object.keys(resEnd.body)).toContain('error')
    expect(resEnd.body.error).toEqual('Error updating sprint: End date is after the start date of the next sprint.')

    expect(resStart.statusCode).toEqual(500)
    expect(Object.keys(resStart.body)).toContain('error')
    expect(resStart.body.error).toEqual('Error updating sprint: Start date is before the end date of the previous sprint.')

    // check that sprint has not been updated
    const updatedSprint1 = await db.Sprint.findOne({ where: { id: sprintId1 } })
    expect(new Date(updatedSprint1.start_date)).toEqual(testSprint.start_date)
    expect(new Date(updatedSprint1.end_date)).toEqual(testSprint.end_date)

    // check that sprint has not been updated
    const updatedSprint2 = await db.Sprint.findOne({ where: { id: sprintId2 } })
    expect(new Date(updatedSprint2.start_date)).toEqual(testSprint2.start_date)
    expect(new Date(updatedSprint2.end_date)).toEqual(testSprint2.end_date)
  })
  test('should fail with if the sprint\'s order changes', async () => {
    await db.Sprint.create({
      sprint: 2,
      start_date: new Date(10),
      end_date: new Date(20),
      created_at: new Date(),
      updated_at: new Date(),
      group_id: groupId
    })

    const login = await loginAs(app, testAdmin.student_number)

    const sprint2BeforeSprint1 = {
      sprint: 2,
      group_id: groupId,
      start_date: new Date(0),
      end_date: new Date(5)
    }

    const res = await request(app)
      .put('/api/sprints/1')
      .set('Authorization', `bearer ${login.token}`)
      .send(sprint2BeforeSprint1)

    expect(res.statusCode).toEqual(500)
    expect(Object.keys(res.body)).toContain('error')
    expect(res.body.error).toContain('Error updating sprint: ')

    // check that sprint has not been updated
    const updatedSprint = await db.Sprint.findOne({ where: { id: sprintId1 } })
    expect(new Date(updatedSprint.start_date)).toEqual(testSprint.start_date)
    expect(new Date(updatedSprint.end_date)).toEqual(testSprint.end_date)
  })

  test('should fail with invalid group_id', async () => {
    const login = await loginAs(app, testAdmin.student_number)

    const sprintUpdate = {
      sprint: 1,
      group_id: 2093,
      start_date: new Date(3),
      end_date: new Date(13)
    }

    const res = await request(app)
      .put('/api/sprints/1')
      .set('Authorization', `bearer ${login.token}`)
      .send(sprintUpdate)

    expect(res.statusCode).toEqual(500)
    expect(Object.keys(res.body)).toContain('error')
    expect(res.body.error).toEqual('Error updating sprint: New group doesn\'t exist.')

    // check that sprint has not been updated
    const updatedSprint1 = await db.Sprint.findOne({ where: { id: sprintId1 } })
    expect(new Date(updatedSprint1.start_date)).toEqual(testSprint.start_date)
    expect(new Date(updatedSprint1.end_date)).toEqual(testSprint.end_date)
    expect(updatedSprint1.group_id).toEqual(testSprint.group_id)
  })

  test('should fail with pre-exising (excluding current) sprint number', async () => {
    await db.Sprint.create({
      sprint: 2,
      start_date: new Date(10),
      end_date: new Date(20),
      created_at: new Date(),
      updated_at: new Date(),
      group_id: groupId
    })
    const login = await loginAs(app, testAdmin.student_number)

    const sprintUpdate = {
      sprint: 2,
      group_id: groupId,
      start_date: new Date(5),
      end_date: new Date(10)
    }

    const res = await request(app)
      .put('/api/sprints/1')
      .set('Authorization', `bearer ${login.token}`)
      .send(sprintUpdate)

    expect(res.statusCode).toEqual(500)
    expect(Object.keys(res.body)).toContain('error')
    expect(res.body.error).toEqual('Error updating sprint: Invalid sprint number, sprint already exists.')

    // check that sprint has not been updated
    const updatedSprint1 = await db.Sprint.findOne({ where: { id: sprintId1 } })
    expect(new Date(updatedSprint1.start_date)).toEqual(testSprint.start_date)
    expect(new Date(updatedSprint1.end_date)).toEqual(testSprint.end_date)
    expect(updatedSprint1.group_id).toEqual(testSprint.group_id)
    expect(updatedSprint1.sprint).toEqual(testSprint.sprint)
  })

  test('should succeed with correct dates and sprint number', async () => {
    const login = await loginAs(app, testAdmin.student_number)

    const sprintUpdate = {
      sprint: 1,
      group_id: groupId,
      start_date: new Date(3),
      end_date: new Date(13)
    }

    const res = await request(app)
      .put('/api/sprints/1')
      .set('Authorization', `bearer ${login.token}`)
      .send(sprintUpdate)

    expect(res.statusCode).toEqual(200)
    expect(Object.keys(res.body)).toContain('message')
    expect(res.body.message).toEqual('Update successful')

    const updatedSprint = await db.Sprint.findOne({ where: { id: sprintId1 } })
    expect(new Date(updatedSprint.start_date)).toEqual(sprintUpdate.start_date)
    expect(new Date(updatedSprint.end_date)).toEqual(sprintUpdate.end_date)
  })
  test.todo('should warn with long gaps between sprints')

  beforeEach(async () => {
    await resetUsers(db)
    await resetGroups(db)
    await resetSprints(db)

    await createTestUser(db, testAdmin)
    groupId = await createTestGroup(db)
    sprintId1 = await createTestSprint(db, groupId)
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
