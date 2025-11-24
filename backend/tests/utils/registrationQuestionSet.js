const createTestRegistrationQuestionSet = async (db) => {
  const createdRegistrationQuestionSet = await db.RegistrationQuestionSet.create({
    name: 'Testikysymyksiä',
    questions: [
      { 'type': 'scale', 'question': 'Ossaakkonää koodata?' },
      { 'type': 'text', 'question': 'Mitä muuta ossaat?' }
    ]
  })
  return createdRegistrationQuestionSet.id
}

module.exports = {
  createTestRegistrationQuestionSet
}
