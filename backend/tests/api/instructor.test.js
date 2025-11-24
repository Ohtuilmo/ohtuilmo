const { describe, test, expect, beforeEach, beforeAll, afterAll } =  require('@jest/globals')
const request = require('supertest')
const jwt = require('jsonwebtoken')

const config = require('../../config/index')
const { app, server, db } = require('../../index')
const { loginAs, createTestUser, resetUsers, testUser } = require("../utils/login")
const { createTestGroup, resetGroups, testInstructor } = require("../utils/groups")


// jwt.verify(resHyPersonId.body.token, config.secret)

describe('Instructor flag', () => {
  test('should be false for a new user without a group', async () => {
    await resetUsers(db)
    const login = await loginAs(app, testUser.student_number)
    expect(jwt.verify(login.token, config.secret).instructor).toEqual(false)
  })
  test('should be false for an old user without a group', async () => {
    const login = await loginAs(app, testUser.student_number)
    expect(jwt.verify(login.token, config.secret).instructor).toEqual(false)
  })
  test('should be false for an user as a student in a group', async () => {
    await resetUsers(db)
    await createTestGroup(db)
    const login = await loginAs(app, testUser.student_number)

    expect(jwt.verify(login.token, config.secret).instructor).toEqual(false)
  })
  test('should be true for an user that is an instructor for a group', async () => {
    await resetUsers(db)
    await createTestGroup(db)
    const login = await loginAs(app, testInstructor.student_number)

    const decodedToken = jwt.verify(login.token, config.secret)
    expect(decodedToken.instructor).not.toEqual(false)
    expect(Object.keys(decodedToken.instructor)).toContain("id", "name", "instructorId", "configurationId")
  })


  beforeEach(async () => {
    await resetUsers(db)
    await createTestUser(db, testUser)
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
