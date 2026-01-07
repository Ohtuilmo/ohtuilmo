const { createTestConfiguration, resetConfigurations } = require('./configuration')

const testContent = {
  email: 'aasia@kas',
  title: 'Aihe A',
  description: 'Joku hyvä kuvaus',
  environment: 'Joku hyvä toteutusympäristö',
  customerName: 'Aasiakas',
  additionalInfo: 'Joku hyvä lisätieto',
  specialRequests: 'Joku hyvä erityistoive'
}

const createTestTopic = async (db, configurationId=0) => {
  const configuration_id = configurationId === 0 ? await createTestConfiguration(db) : configurationId

  const createdTopic = await db.Topic.create({
    active: true,
    configuration_id,
    content: testContent,
    acronym: null,
    secret_id: 'jokutosisalanenid',
  })

  return createdTopic.id
}

const resetTopics = async (db) => {
  // Might get called multiple times if configuration was given as a parameter
  await resetConfigurations(db)
  await db.Topic.truncate({ cascade: true, restartIdentity: true })
}

module.exports = {
  testContent,
  createTestTopic,
  resetTopics
}
