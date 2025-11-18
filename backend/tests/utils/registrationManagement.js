const { createTestConfiguration } = require('./configuration')

const testRegistrationManagement = {
  peer_review_conf: 1,
  peer_review_open: 1,
  peer_review_round: 1,
  project_registration_conf: 1,
  project_registration_open: 1,
  project_registration_message: 'Aukeloo joskus syssymmällä',
  project_registration_info: 'Ompi auki toestaseks',
  topic_registration_conf: 1,
  topic_registration_open: 1,
  topic_registration_message: 'Aukeloo joskus syssymmällä kans'
}

const updateRegManConfigurationId = (testRegMan, confId) => {
  testRegMan.peer_review_conf = confId
  testRegMan.project_registration_conf = confId
  testRegMan.topic_registration_conf = confId
  return testRegMan
}

const createTestRegistrationManagement = async (db) => {
  const configurationId = await createTestConfiguration(db)
  const testRegManCopy = JSON.parse(JSON.stringify(testRegistrationManagement))

  await db.RegistrationManagement.create(updateRegManConfigurationId(testRegManCopy, configurationId))
  return (await db.RegistrationManagement.findAll({}))[0].id
}

module.exports = {
  createTestRegistrationManagement,
  testRegistrationManagement
}
