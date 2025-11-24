const { createTestUsers, testUsers } = require('./login')
const { createTestConfiguration } = require('./configuration')
const { createTestTopic } = require('./topic')


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

const createTestGroup = async (db, users=testUsers, instructor=testInstructor) => {
  await createTestUsers(db, [users[0], users[1], instructor])

  const configurationId = await createTestConfiguration(db)
  const topicId = await createTestTopic(db, configurationId)

  const createdGroup = await db.Group.create({
    name: 'Testigrouppi',
    topicId: topicId,
    configurationId: configurationId,
    instructorId: testInstructor.student_number,
  })
  await createdGroup.setStudents([testUsers[0].student_number, testUsers[1].student_number])
  return createdGroup.id
}

module.exports = {
  testGroup,
  createTestGroup,
  createTestInstructor,
  testInstructor
}
