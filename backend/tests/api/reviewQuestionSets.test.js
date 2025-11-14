const { describe, test, expect, beforeEach, beforeAll, afterAll } =  require('@jest/globals')
const request = require('supertest')

const { app, server, db } = require('../../index')
const { loginAs, adminTemplate } = require('../utils')


describe('Review question sets', () => {
  test('should be created with name and correct permissions', async () => {
    expect(await db.ReviewQuestionSet.findAll({ where: { name: 'Vaikeat kysymykset' } })).toHaveLength(0)

    const userId = 120948710
    await db.User.create(adminTemplate(userId))

    const login = await loginAs(app, userId)
    const res = await request(app)
      .post('/api/reviewQuestions')
      .set('Authorization', `bearer ${login.token}`)
      .send({ name: 'Vaikeat kysymykset', questions: { 'type': 'scale', 'question': 'Osaatko koodata?' } })

    expect(res.statusCode).toEqual(200)
    expect(Object.keys(res.body)).toContain('questionSet')
    expect(await db.ReviewQuestionSet.findAll({ where: { name: 'Vaikeat kysymykset' } })).toHaveLength(1)
  })

  test('should not be created with missing or pre-existing name', async () => {
    expect(await db.ReviewQuestionSet.findAll({ where: { name: 'Vaikeat kysymykset' } })).toHaveLength(0)

    const userId = 10329472340
    await db.User.create(adminTemplate(userId))

    const login = await loginAs(app, userId)
    const res = await request(app)
      .post('/api/reviewQuestions')
      .set('Authorization', `bearer ${login.token}`)
      .send({ name: 'Vaikeat kysymykset' })

    const resDuplicate = await request(app)
      .post('/api/reviewQuestions')
      .set('Authorization', `bearer ${login.token}`)
      .send({ name: 'Vaikeat kysymykset' })

    expect(res.statusCode).toEqual(200)
    expect(Object.keys(res.body)).toContain('questionSet')

    expect(resDuplicate.statusCode).toEqual(400)
    expect(Object.keys(resDuplicate.body)).toContain('error')

    // Only one is created
    expect(await db.ReviewQuestionSet.findAll({ where: { name: 'Vaikeat kysymykset' } })).toHaveLength(1)
  })

  beforeAll(async () => {
    await db.sequelize.truncate({ cascade: true, restartIdentity: true })
  })
  beforeEach(async () => { await db.ReviewQuestionSet.truncate({ cascade: true })})
  afterAll(async () => {
    server.close()
    // https://github.com/forwardemail/supertest/issues/520#issuecomment-1242761766
    await new Promise((res) => {
      setTimeout(res, 1)
    })
  })
})
