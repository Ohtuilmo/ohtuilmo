const { describe, test, expect, beforeEach, beforeAll, afterAll } =  require('@jest/globals')
const jwt = require('jsonwebtoken')

const config = require('../../config/index')
const { app, server, db } = require('../../index')
const { loginAs, createTestUser, createTestUsers, resetUsers, testUser, testUsers } = require('../utils/login')
const { createTestGroup, resetGroups, testInstructor } = require('../utils/groups')


describe('Instructor flag', () => {
  test('should be false for a new user without a group', async () => {
    await createTestUser(db, testUser)
    const login = await loginAs(app, testUser.student_number)
    expect(jwt.verify(login.token, config.secret).instructor).toEqual(false)
  })
  test('should be false for an old user without a group', async () => {
    await createTestUser(db, testUser)
    const login = await loginAs(app, testUser.student_number)
    expect(jwt.verify(login.token, config.secret).instructor).toEqual(false)
  })
  test('should be false for an user as a student in a group', async () => {
    await createTestGroup(db)
    const login = await loginAs(app, testUser.student_number)

    expect(jwt.verify(login.token, config.secret).instructor).toEqual(false)
  })
  test('should be true for an user that is an instructor for a group', async () => {
    await createTestGroup(db)
    const login = await loginAs(app, testInstructor.student_number)

    const decodedToken = jwt.verify(login.token, config.secret)
    expect(decodedToken.instructor).toEqual(true)
  })

  test('should be true for instructor that has instructed for multiple times', async () => {
    await createTestUsers(db, [...testUsers, testInstructor])
    await createTestGroup(db, [testUsers[1], testUsers[2]], testInstructor, false)
    await createTestGroup(db, [testUsers[0]], testInstructor, false)

    const login = await loginAs(app, testInstructor.student_number)

    const decodedToken = jwt.verify(login.token, config.secret)
    expect(decodedToken.instructor).toEqual(true)
  })

  test('should be true for ongoing instructor while another project registration starts', async () => {
    const anotherInstructor = JSON.parse(JSON.stringify(testInstructor))
    anotherInstructor.student_number = 55555555555
    await createTestUsers(db, [...testUsers, testInstructor, anotherInstructor])
    await createTestGroup(db, [testUsers[1], testUsers[2]], testInstructor, false)
    await createTestGroup(db, [testUsers[0]], anotherInstructor, false)

    const login = await loginAs(app, testInstructor.student_number)

    const decodedToken = jwt.verify(login.token, config.secret)
    expect(decodedToken.instructor).toEqual(true)
  })

  test('should be false for instructor that has instructed in the past but not currently', async () => {
    const anotherInstructor = JSON.parse(JSON.stringify(testInstructor))
    anotherInstructor.student_number = 55555555555
    await createTestUsers(db, [...testUsers, testInstructor, anotherInstructor])
    await createTestGroup(db, [testUsers[1], testUsers[2]], testInstructor, false)
    await createTestGroup(db, [testUsers[0]], anotherInstructor, false)

    const login = await loginAs(app, testInstructor.student_number)

    const decodedToken = jwt.verify(login.token, config.secret)
    expect(decodedToken.instructor).toEqual(false)
  })


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
