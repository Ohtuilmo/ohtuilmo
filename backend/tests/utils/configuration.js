const { createTestRegistrationQuestionSet, resetRegistrationQuestionSets } = require('./registrationQuestionSet')

const createTestConfiguration = async (db) => {
  const registrationQuestionSetId = await createTestRegistrationQuestionSet(db)
  const createdConfiguration = await db.Configuration.create({
    name: 'Konfiguraatiolainen',
    content: { registrationQuestionSetId }
  })
  return createdConfiguration.id
}

const resetConfigurations = async (db) => {
  await resetRegistrationQuestionSets(db)
  await db.Configuration.truncate({ cascade: true, restartIdentity: true })
}

module.exports = {
  createTestConfiguration,
  resetConfigurations
}
