const { createTestRegistrationQuestionSet } = require('./registrationQuestionSet')

const createTestConfiguration = async (db) => {
  const registrationQuestionSetId = await createTestRegistrationQuestionSet(db)
  const createdConfiguration = await db.Configuration.create({
    name: 'Konfiguraatiolainen',
    content: { registrationQuestionSetId }
  })
  return createdConfiguration.id
}

module.exports = {
  createTestConfiguration
}
