const { createTestRegistrationQuestionSet } = require('./registrationQuestionSet')

const createTestConfiguration = async (db) => {
  const registrationQuestionSetId = await createTestRegistrationQuestionSet(db)
  await db.Configuration.create({
    name: 'Konfiguraatiolainen',
    content: { registrationQuestionSetId }
  })
  return (await db.Configuration.findAll({}))[0].id
}

module.exports = {
  createTestConfiguration
}
