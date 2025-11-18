const createTestRegistrationQuestionSet = async (db) => {
  await db.RegistrationQuestionSet.create({
    name: 'Testikysymyksiä',
    questions: [
      { 'type': 'scale', 'question': 'Ossaakkonää koodata?' },
      { 'type': 'text', 'question': 'Mitä muuta ossaat?' }
    ]
  })
  return (await db.RegistrationQuestionSet.findAll({}))[0].id
}

module.exports = {
  createTestRegistrationQuestionSet
}
