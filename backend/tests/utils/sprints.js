const { createTestGroup, resetGroups } = require("./groups")

const testSprint = {
  sprint: 1,
  start_date: new Date(5),
  end_date: new Date(10),
  group_id: 1
}

const createTestSprint = async (db, groupId=0) => {
  const group_id = groupId === 0 ? await createTestGroup(db) : groupId
  const createdSprint = await db.Sprint.create({
    sprint: 1,
    start_date: new Date(5),
    end_date: new Date(10),
    created_at: new Date(),
    updated_at: new Date(),
    group_id
  })

  return createdSprint.id
}

const resetSprints = async (db) => {
  await resetGroups(db)
  await db.Sprint.truncate({ cascade: true, restartIdentity: true })
}

module.exports = {
  createTestSprint,
  resetSprints,
  testSprint
}
