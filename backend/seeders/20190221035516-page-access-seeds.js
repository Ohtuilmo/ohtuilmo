'use strict'

const initialRegistrationManagement = [
  {
    project_registration_conf: 1,
    project_registration_open: true,
    project_registration_message:
      'Project registration will open on DD.MM.YYYY.',
    project_registration_info:
      'Project registration will be open until DD.MM.YYYY.',
    topic_registration_conf: 1,
    topic_registration_open: true,
    topic_registration_message: 'Topic registration will open on DD.MM.YYYY.',
    peer_review_conf: 1,
    peer_review_open: true,
    peer_review_round: 1
  }
]

const initialUsers = [
  {
    student_number: '012345678',
    username: 'testertester',
    first_names: 'Timo *Teppo Tellervo',
    last_name: 'Testaaja',
    email: '',
    admin: false
  },
  {
    student_number: '012345688',
    username: 'testertester2',
    first_names: 'Angela',
    last_name: 'Merkel',
    email: '',
    admin: true
  },
  {
    student_number: '012345698',
    username: 'testertester3',
    first_names: 'Donald John',
    last_name: 'Trump',
    email: '',
    admin: false
  }
]

const initialQuestionsWithAnswers = [
  {
    type: 'scale',
    answer: 5,
    question: 'Osaatko koodata?'
  },
  {
    type: 'text',
    answer: 'Jo vain, olen helvetin kova tykittelemään jäsää!?!',
    question: 'Oletko varma, että osaat koodata?'
  }
]

const initialRegistrationQuestionSet = [
  {
    name: 'Kysymyssetti 1',
    questions: JSON.stringify(
      initialQuestionsWithAnswers.map((item) => {
        return {
          type: item.type,
          question: item.question
        }
      })
    )
  }
]

const initialConfiguration = [
  {
    name: 'Konfiguraatio 1',
    registration_question_set_id: 1,
    created_at: new Date(),
    updated_at: new Date()
  }
]

const initialTopic = [
  {
    active: true,
    acronym: '',
    content: JSON.stringify({
      email: 'aasia@kas',
      title: 'Aihe A',
      description: 'Joku hyvä kuvaus',
      environment: 'Joku hyvä toteutusympäristö',
      customerName: 'Aasiakas',
      additionalInfo: 'Joku hyvä lisätieto',
      specialRequests: 'Joku hyvä erityistoive'
    }),
    secret_id: 'eec0neeT0jo0ae9F',
    configuration_id: 1
  }
]

const initialPreferredTopics = [
  {
    id: 1,
    active: true,
    acronym: '',
    content: {
      email: 'aasia@kas',
      title: 'Aihe A',
      description: 'Joku hyvä kuvaus',
      environment: 'Joku hyvä toteutusympäristö',
      customerName: 'Aasiakas',
      additionalInfo: 'Joku hyvä lisätieto',
      specialRequests: 'Joku hyvä erityistoive'
    },
    secret_id: 'eec0neeT0jo0ae9F',
    configuration_id: 1
  }
]

const initialRegistration = [
  {
    preferred_topics: JSON.stringify(initialPreferredTopics),
    questions: JSON.stringify(initialQuestionsWithAnswers),
    configuration_id: 1,
    studentStudentNumber: '012345698'
  }
]

const addTimeStamps = (arr) => {
  return arr.map((item) => {
    return {
      ...item,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  })
}

module.exports = {
  up: async (query) => {
    await query.bulkInsert('users', addTimeStamps(initialUsers), {})
    await query.bulkInsert(
      'registration_question_sets',
      addTimeStamps(initialRegistrationQuestionSet),
      {}
    )
    await query.bulkInsert('configurations', initialConfiguration, {})
    await query.bulkInsert(
      'registration_managements',
      addTimeStamps(initialRegistrationManagement),
      {}
    )
    await query.bulkInsert('topics', addTimeStamps(initialTopic), {})
    await query.bulkInsert(
      'registrations',
      addTimeStamps(initialRegistration),
      {}
    )
  },

  down: async (query) => {
    await query.bulkDelete('registration_managements', null, {})
    await query.bulkDelete('users', null, {})
    await query.bulkDelete('registration_question_sets', null, {})
    await query.bulkDelete('configurations', null, {})
    await query.bulkDelete('topics', null, {})
    await query.bulkDelete('registrations', null, {})
  }
}
