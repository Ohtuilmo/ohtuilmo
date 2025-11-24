const { describe, test, expect, beforeEach, beforeAll, afterAll } =  require('@jest/globals')
const request = require('supertest')

const { app, server, db } = require('../../index')
const { loginAs, createAndLoginAs, testUser, testAdmin } = require('../utils/login')
const { testInstructor, createTestInstructor } = require('../utils/groups')


describe('Login with token', () => {
  test('of a not-logined user should not pass any checkRole', async () => {
    const resLogin = await request(app).get('/api/tokenCheck/login')
    const resInstructor = await request(app).get('/api/tokenCheck/instructor')
    const resAdmin = await request(app).get('/api/tokenCheck/admin')

    expect(resLogin.statusCode).toEqual(401)
    expect(resInstructor.statusCode).toEqual(401)
    expect(resAdmin.statusCode).toEqual(401)

    expect(Object.keys(resLogin.body)).toContain('error')
    expect(Object.keys(resInstructor.body)).toContain('error')
    expect(Object.keys(resAdmin.body)).toContain('error')
  })

  test('of a normal user should pass checkLogin', async () => {
    const login = await createAndLoginAs(db, app, testUser)

    const res = await request(app)
      .get('/api/tokenCheck/login')
      .set('Authorization', `bearer ${login.token}`)

    expect(res.statusCode).toEqual(200)
    expect(res.body).toEqual({ 'message': 'success' })
  })
  test('of a normal user should not pass checkInstructor or checkAdmin', async () => {
    const login = await createAndLoginAs(db, app, testUser)

    const resInstructor = await request(app)
      .get('/api/tokenCheck/instructor')
      .set('Authorization', `bearer ${login.token}`)

    const resAdmin = await request(app)
      .get('/api/tokenCheck/admin')
      .set('Authorization', `bearer ${login.token}`)

    expect(resInstructor.statusCode).toEqual(401)
    expect(Object.keys(resInstructor.body)).toContain('error')

    expect(resAdmin.statusCode).toEqual(401)
    expect(Object.keys(resAdmin.body)).toContain('error')
  })

  test('of an instructor should pass checkLogin and checkInstructor', async () => {
    await createTestInstructor(db)
    const login = await loginAs(app, testInstructor.student_number)

    const resLogin = await request(app)
      .get('/api/tokenCheck/login')
      .set('Authorization', `bearer ${login.token}`)
    const resInstructor = await request(app)
      .get('/api/tokenCheck/instructor')
      .set('Authorization', `bearer ${login.token}`)

    expect(resLogin.statusCode).toEqual(200)
    expect(resLogin.body).toEqual({ 'message': 'success' })

    expect(resInstructor.body).toEqual({ 'message': 'success' })
    expect(resInstructor.statusCode).toEqual(200)
  })
  test('of an instructor should not pass checkAdmin', async () => {
    await createTestInstructor(db)
    const login = await loginAs(app, testInstructor.student_number)

    const resAdmin = await request(app)
      .get('/api/tokenCheck/admin')
      .set('Authorization', `bearer ${login.token}`)

    expect(resAdmin.statusCode).toEqual(401)
    expect(resAdmin.body).toEqual({ 'error': 'not admin' })
  })


  test('of an admin should pass checkLogin, checkInstructor and checkAdmin', async () => {
    const login = await createAndLoginAs(db, app, testAdmin)

    const resUser = await request(app)
      .get('/api/tokenCheck/login')
      .set('Authorization', `bearer ${login.token}`)

    const resInstructor = await request(app)
      .get('/api/tokenCheck/instructor')
      .set('Authorization', `bearer ${login.token}`)

    const resAdmin = await request(app)
      .get('/api/tokenCheck/admin')
      .set('Authorization', `bearer ${login.token}`)

    expect(resUser.statusCode).toEqual(200)
    expect(Object.keys(resUser.body)).toContain('message')
    expect(resUser.body.message).toEqual('success')

    expect(resInstructor.statusCode).toEqual(200)
    expect(Object.keys(resInstructor.body)).toContain('message')
    expect(resInstructor.body.message).toEqual('success')

    expect(resAdmin.statusCode).toEqual(200)
    expect(Object.keys(resAdmin.body)).toContain('message')
    expect(resAdmin.body.message).toEqual('success')
  })

  beforeAll(async () => {
    await db.sequelize.truncate({ cascade: true, restartIdentity: true })
  })
  beforeEach(async () => {
    await db.User.truncate({ cascade: true })
  })
  afterAll(async () => {
    server.close()
    // https://github.com/forwardemail/supertest/issues/520#issuecomment-1242761766
    await new Promise((res) => {
      setTimeout(res, 1)
    })
  })
})
