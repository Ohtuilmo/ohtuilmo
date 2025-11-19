const { createTestRegistrationManagement } = require('./registrationManagement')

const testContent = {
  email: 'aasia@kas',
  title: 'Aihe A',
  description: 'Joku hyvä kuvaus',
  environment: 'Joku hyvä toteutusympäristö',
  customerName: 'Aasiakas',
  additionalInfo: 'Joku hyvä lisätieto',
  specialRequests: 'Joku hyvä erityistoive'
}

const createTestTopic = async (db) => {
  await createTestRegistrationManagement(db)
  const configuration_id = (await db.Configuration.findAll({}))[0].id

  await db.Topic.create({
    active: true,
    configuration_id,
    content: testContent,
    acronym: null,
    secret_id: 'jokutosisalanenid',
  })

  return (await db.Topic.findAll({}))[0].id
}

module.exports = {
  testContent,
  createTestTopic
}
