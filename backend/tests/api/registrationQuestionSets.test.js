const { describe, test, expect, beforeEach, beforeAll, afterAll } =  require('@jest/globals')
const request = require('supertest')

const { app, server, db } = require('../../index')
const { createAndLoginAs, testAdmin } = require('../utils/login')


describe('Registration question sets', () => {
  test('should be created with name', async () => {
    expect(await db.RegistrationQuestionSet.findAll({ where: { name: 'Vaikeat kysymykset' } })).toHaveLength(0)

    const login = await createAndLoginAs(db, app, testAdmin)
    const res = await request(app)
      .post('/api/registrationQuestions')
      .set('Authorization', `bearer ${login.token}`)
      .send({ name: 'Vaikeat kysymykset', questions: [ { 'type': 'scale', 'question': 'Ossaakkonää koodata?' }, { 'type': 'text', 'question': 'Mitä muuta ossaat?' } ] })

    expect(res.statusCode).toEqual(200)
    expect(Object.keys(res.body)).toContain('questionSet')
    expect(await db.RegistrationQuestionSet.findAll({ where: { name: 'Vaikeat kysymykset' } })).toHaveLength(1)
  })

  test('should not be created with missing or pre-existing name', async () => {
    expect(await db.RegistrationQuestionSet.findAll({ where: { name: 'Vaikeat kysymykset' } })).toHaveLength(0)

    const login = await createAndLoginAs(db, app, testAdmin)
    const res = await request(app)
      .post('/api/registrationQuestions')
      .set('Authorization', `bearer ${login.token}`)
      .send({ name: 'Vaikeat kysymykset', questions: [] })

    expect(await db.RegistrationQuestionSet.findAll({ where: { name: 'Vaikeat kysymykset' } })).toHaveLength(1)

    const resDuplicate = await request(app)
      .post('/api/registrationQuestions')
      .set('Authorization', `bearer ${login.token}`)
      .send({ name: 'Vaikeat kysymykset', questions: [] })

    expect(await db.RegistrationQuestionSet.findAll({ where: { name: 'Vaikeat kysymykset' } })).toHaveLength(1)

    expect(res.statusCode).toEqual(200)
    expect(Object.keys(res.body)).toContain('questionSet')

    expect(resDuplicate.statusCode).toEqual(400)
    expect(Object.keys(resDuplicate.body)).toContain('error')
    expect(resDuplicate.body.error).toEqual('name already in use')

    // Only one is created
    expect(await db.RegistrationQuestionSet.findAll({ where: { name: 'Vaikeat kysymykset' } })).toHaveLength(1)
  })

  beforeEach(async () => {
    await db.RegistrationQuestionSet.truncate({ cascade: true })
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
