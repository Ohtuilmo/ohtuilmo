const { expect } =  require('@jest/globals')
const request = require('supertest')

const loginAs = async (app, studentNumber) => {
  const res = await request(app)
    .post('/api/login')
    .set('hypersonstudentid', studentNumber)

  // Sanity-check
  expect(Object.keys(res.body)).toContain('user', 'token')
  return { user: res.body.user, token: res.body.token }
}

const userTemplate = (studentNumber) => {
  return {
    username: 'Minä',
    student_number: studentNumber,
    first_names: 'Minä',
    last_name: 'Sukunimi',
    email: 'minä@me.fi',
    admin: false
  }
}

const adminTemplate = (studentNumber) => {
  return {
    username: 'mluukkai',
    student_number: studentNumber,
    first_names: 'Matti',
    last_name: 'Luukkainen',
    email: 'jokutosihassu@sähköposti.fi',
    admin: true
  }
}

module.exports = { loginAs, userTemplate, adminTemplate }
