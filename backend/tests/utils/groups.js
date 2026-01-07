const { createTestUsers, createTestUser, resetUsers, testUsers } = require('./login')
const { createTestConfiguration, resetConfigurations } = require('./configuration')
const { createTestTopic, resetTopics } = require('./topic')


const testGroup = {
  name: 'Testiryhmä',
  topicId: 0,
  configurationId: 0,
  instructorId: 0,
  studentIds: [0, 0]
}

const testInstructor = {
  username: 'paavixii',
  student_number: 3333333333333,
  first_names: 'Pius',
  last_name: 'XII',
  email: 'puavi@vatikaani.fi',
  admin: false
}


const createTestInstructor = async (db) => {
  await createTestGroup(db)
  return testInstructor.student_number
}

const createTestGroup = async (db, users=testUsers, instructor=testInstructor, createUsers=true) => {
  const createdUsers = createUsers ? await createTestUsers(db, users) : users
  const createdInstructor = createUsers ? await createTestUser(db, instructor) : instructor

  const configurationId = await createTestConfiguration(db)
  const topicId = await createTestTopic(db, configurationId)

  const createdGroup = await db.Group.create({
    name: 'Testigrouppi',
    topicId: topicId,
    configurationId: configurationId,
    instructorId: createdInstructor.student_number,
  })
  await createdGroup.setStudents(createdUsers.map(user => user.student_number))
  return createdGroup.id
}

const resetGroups = async (db) => {
  await resetUsers(db)
  await resetConfigurations(db)
  await resetTopics(db)
  await db.Group.truncate({ cascade: true, restartIdentity: true })
}

const resetInstructor = async (db) => {
  await resetGroups(db)
}

module.exports = {
  testGroup,
  createTestGroup,
  createTestInstructor,
  testInstructor,
  resetGroups,
  resetInstructor
}
