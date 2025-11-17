const { expect } =  require('@jest/globals')
const request = require('supertest')


const createTestUser = async (db, user) => {
  await db.User.create(user)
  return user
}

const createAndLoginAs = async (db, app, user) => {
  await db.User.create(user)
  return await loginAs(app, user.student_number)
}

const loginAs = async (app, studentNumber) => {
  const res = await request(app)
    .post('/api/login')
    .set('hypersonstudentid', studentNumber)

  // Sanity-check
  expect(Object.keys(res.body)).toContain('user', 'token')
  return { user: res.body.user, token: res.body.token }
}

const testUser = {
  username: 'minää',
  student_number: 987654321,
  first_names: 'Minä',
  last_name: 'Sukunimi',
  email: 'minä@me.fi',
  admin: false
}

const testAdmin = {
  username: 'mluukkai',
  student_number: 1234567890,
  first_names: 'Matti',
  last_name: 'Luukkainen',
  email: 'jokutosihassu@sähköposti.fi',
  admin: true
}

const testUsers = [
  testUser,
  {
    username: 'sinää',
    student_number: 103952409,
    first_names: 'Sinä',
    last_name: 'Sukunimi',
    email: 'sinä@you.fi',
    admin: false
  },
  {
    username: 'hänn',
    student_number: 230984092,
    first_names: 'Hän',
    last_name: 'Sukunimi',
    email: 'hän@shhe.fi',
    admin: false
  }
]

module.exports = { loginAs, createTestUser, createAndLoginAs, testUser, testAdmin, testUsers }
