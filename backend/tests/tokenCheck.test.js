const { describe, test, expect, beforeEach, beforeAll, afterAll } =  require('@jest/globals')
const request = require('supertest')

const { app, server, db } = require('../index')

const loginAs = async (studentNumber) => {
  const res = await request(app)
    .post('/api/login')
    .set('hypersonstudentid', studentNumber)

  // Sanity-check
  expect(Object.keys(res.body)).toContain('user', 'token')
  return { user: res.body.user, token: res.body.token }
}

const testUser = {
  username: 'Minä',
  student_number: '123454321123',
  first_names: 'Minä',
  last_name: 'Sukunimi',
  email: 'minä@me.fi',
  admin: false
}

const testAdmin = {
  username: 'mluukkai',
  student_number: '1234567890',
  first_names: 'Matti',
  last_name: 'Luukkainen',
  email: 'jokutosihassu@sähköposti.fi',
  admin: true
}

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
    await db.User.create(testUser)

    const login = await loginAs(123454321123)

    const res = await request(app)
      .get('/api/tokenCheck/login')
      .set('Authorization', `bearer ${login.token}`)

    expect(res.statusCode).toEqual(200)
    expect(res.body).toEqual({ 'message': 'success' })
  })
  test('of a normal user should not pass checkInstructor or checkAdmin', async () => {
    await db.User.create(testUser)

    const login = await loginAs(123454321)

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

  // TODO needs groups to work
  test.todo('of an instructor should pass checkLogin and checkInstructor')
  test.todo('of an instructor should not pass checkAdmin')

  test('of an admin should pass checkLogin, checkInstructor and checkAdmin', async () => {
    await db.User.create(testAdmin)

    const login = await loginAs(1234567890)

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
