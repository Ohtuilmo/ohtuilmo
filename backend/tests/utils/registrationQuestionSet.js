const createTestRegistrationQuestionSet = async (db) => {
  const createdRegistrationQuestionSet = await db.RegistrationQuestionSet.create({
    name: 'Testikysymyksiä',
    questions: [
      { type: 'scale', question: 'Ossaakkonää koodata?' },
      { type: 'text', question: 'Mitä muuta ossaat?' },
    ],
  })
  return createdRegistrationQuestionSet.id
}

const resetRegistrationQuestionSets = async (db) => {
  await db.RegistrationQuestionSet.truncate({ cascade: true, restartIdentity: true })
}

module.exports = {
  createTestRegistrationQuestionSet,
  resetRegistrationQuestionSets,
}
