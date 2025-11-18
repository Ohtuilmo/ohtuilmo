// const { loginAs, createTestUser, testAdmin, testUsers } = require('./login')
const { createRegistrationQuestionSet } = require('./registrationQuestionSet')

const createTestConfiguration = async (db) => {
  const registrationQuestionSetId = await createRegistrationQuestionSet(db)
  await db.Configuration.create({
    name: 'Konfiguraatiolainen',
    content: { registrationQuestionSetId }
  })
}

module.export = {
  createTestConfiguration
}
