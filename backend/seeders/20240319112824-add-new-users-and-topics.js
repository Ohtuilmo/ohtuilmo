'use strict'

const initialQuestionsWithAnswers = [
  {
    type: 'scale',
    answer: 5,
    question: 'Osaatko koodata?'
  },
  {
    type: 'text',
    answer: 'En mutta olen nopea oppimaan :))))',
    question: 'Oletko varma, että osaat koodata?'
  }
]
const newUsers = [
  {
    student_number: '112345699',
    username: 'olliohj',
    first_names: 'Olli',
    last_name: 'Ohjaaja',
    email: 'olliohjaaja@example.com',
    admin: false,
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    student_number: '112345700',
    username: 'newuser1',
    first_names: 'New',
    last_name: 'User',
    email: 'newuser1@example.com',
    admin: false,
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    student_number: '112345701',
    username: 'johnsmith',
    first_names: 'John',
    last_name: 'Smith',
    email: 'johnsmith@email.com',
    admin: false,
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    student_number: '112345702',
    username: 'jane.madison',
    first_names: 'Jane',
    last_name: 'Madison',
    email: 'test@gmail.com',
    admin: false,
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    student_number: '112345703',
    username: 'instruct1',
    first_names: 'Instructor',
    last_name: 'One',
    email: 'inst@gmail.com',
    admin: false,
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    student_number: '112345704',
    username: 'timoTekoäly',
    first_names: 'Timo',
    last_name: 'Tekoäly',
    email: 'timoTeko@gmail.com',
    admin: false,
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    student_number: '112345705',
    username: 'johannakoodari',
    first_names: 'Johanna',
    last_name: 'Koodari',
    email: 'kodari@gmail.com',
    admin: false,
    created_at: new Date(),
    updated_at: new Date()
  }
]


const newConfiguration1 = [
  {
    name: 'Kevät 2023',
    registration_question_set_id: 1,
    created_at: new Date(),
    updated_at: new Date()
  }
]

const newConfiguration2 = [
  {
    name: 'Syksy 2023',
    registration_question_set_id: 1,
    created_at: new Date(),
    updated_at: new Date()
  }
]

const newConfiguration3 = [
  {
    name: 'Kevät 2024',
    registration_question_set_id: 1,
    created_at: new Date(),
    updated_at: new Date()
  }
]



const newTopics = [
  {
    active: true,
    acronym: '',
    content: JSON.stringify({
      email: 'contact@newtopic1.com',
      title: 'Ohjelmistotuotantoprojektin laajennus',
      description: 'Parannetaan ohjelmistotuotantoprojektin toimintaa lisäämällä uusia ominaisuuksia.',
      environment: 'Node.js, React',
      customerName: 'Uusi Asiakas',
      additionalInfo: 'Lisätietoja Uusi Aihe 1',
      specialRequests: 'Erityistoiveet Uusi Aihe 1'
    }),
    secret_id: 'newtopic1secret',
    configuration_id: 1,
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    active: true,
    acronym: '',
    content: JSON.stringify({
      email: 'contact@newtopic2.com',
      title: 'TeKOäLYn soveltaminen',
      description: 'Käytetään tekoälyä johonkin hyödylliseen.',
      environment: 'Python, Django',
      customerName: 'Uusi Asiakas 2',
      additionalInfo: 'Lisätietoja TeKOäLYn soveltaminen',
      specialRequests: 'Erityistoiveet TeKOäLYn soveltaminen'
    }),
    secret_id: 'newtopic2secret',
    configuration_id: 1,
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    active: true,
    acronym: '',
    content: JSON.stringify({
      email: 'topic123@gmail.com',
      title: 'Optimization application for a logistics company',
      description: 'Develop an application for a logistics company to optimize their operations.',
      environment: 'React, Node.js, MongoDB',
      customerName: 'Logistics Company',
      additionalInfo: 'More information about the topic',
      specialRequests: 'Special requests for the topic'
    }),
    secret_id: 'topic123secret',
    configuration_id: 3,
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    active: true,
    acronym: '',
    content: JSON.stringify({
      email: 'topic897@gmail.com',
      title: 'AI in a mobile application',
      description: 'Develop an AI feature for a mobile application.',
      environment: 'React Native, Node.js',
      customerName: 'Mobile Application Company',
      additionalInfo: 'More information about the topic',
      specialRequests: 'Special requests for the topic'
    }),
    secret_id: 'topic897secret',
    configuration_id: 3,
    created_at: new Date(),
    updated_at: new Date()
  },
]

const initialPreferredTopics = [
  {
    id: 4,
    active: true,
    acronym: '',
    content: JSON.stringify({
      email: 'contact@newtopic1.com',
      title: 'Ohjelmistotuotantoprojektin laajennus',
      description: 'Parannetaan ohjelmistotuotantoprojektin toimintaa lisäämällä uusia ominaisuuksia.',
      environment: 'Node.js, React',
      customerName: 'Uusi Asiakas',
      additionalInfo: 'Lisätietoja Uusi Aihe 1',
      specialRequests: 'Erityistoiveet Uusi Aihe 1'
    }),
    secret_id: 'newtopic1secret',
    configuration_id: 1,
  }
]

const initialRegistration = [
  {
    preferred_topics: JSON.stringify(initialPreferredTopics),
    questions: JSON.stringify(initialQuestionsWithAnswers),
    configuration_id: 1,
    student_student_number: '112345700'
  },
  {
    preferred_topics: JSON.stringify(initialPreferredTopics),
    questions: JSON.stringify(initialQuestionsWithAnswers),
    configuration_id: 1,
    student_student_number: '112345701'
  },
  {
    preferred_topics: JSON.stringify(initialPreferredTopics),
    questions: JSON.stringify(initialQuestionsWithAnswers),
    configuration_id: 1,
    student_student_number: '112345702'
  },
  {
    preferred_topics: JSON.stringify(initialPreferredTopics),
    questions: JSON.stringify(initialQuestionsWithAnswers),
    configuration_id: 1,
    student_student_number: '112345704'
  },
  {
    preferred_topics: JSON.stringify(initialPreferredTopics),
    questions: JSON.stringify(initialQuestionsWithAnswers),
    configuration_id: 1,
    student_student_number: '112345705'
  }
]

const newGroup = [
  {
    name: 'ohtuilmo-ryhmä',
    topic_id: 4,
    configuration_id: 1,
    instructor_id: 112345699,
  },
  {
    name: 'tekOäly-ryhmä',
    topic_id: 5,
    configuration_id: 1,
    instructor_id: 112345703 ,
  },
  {
    name: 'ohtuilmo-ryhmä2',
    topic_id: 6,
    configuration_id: 2,
    instructor_id: 112345699,
  },
]

const group_students = [
  {
    group_id: 1,
    user_student_number: 112345700
  },
  {
    group_id: 1,
    user_student_number: 112345701
  },
  {
    group_id: 1,
    user_student_number: 112345702
  },
  {
    group_id: 2,
    user_student_number: 112345704
  },
  {
    group_id: 2,
    user_student_number: 112345705
  }
]

const addTimeStamps = (arr) => {
  return arr.map((item) => {
    return {
      ...item,
      created_at: new Date(),
      updated_at: new Date()
    }
  })
}

module.exports = {
  up: async (query) => {
    await query.bulkInsert('users', addTimeStamps(newUsers), {})
    await query.bulkInsert('configurations', addTimeStamps(newConfiguration1), {})
    await query.bulkInsert('configurations', addTimeStamps(newConfiguration2), {})
    await query.bulkInsert('configurations', addTimeStamps(newConfiguration3), {})
    await query.bulkInsert('topics', addTimeStamps(newTopics), {})
    await query.bulkInsert('groups', addTimeStamps(newGroup), {})
    await query.bulkInsert('group_students', addTimeStamps(group_students), {})
    await query.bulkInsert(
      'registrations',
      addTimeStamps(initialRegistration),
      {}
    )
  },

  down: async (query) => {
    await query.bulkDelete('topics', { secret_id: ['newtopic1secret', 'newtopic2secret', 'topic123secret', 'topic897secret'] }, {})
    await query.bulkDelete('configurations', { name: ['Kevät 2024', 'Syksy 2023', 'Kevät 2023'] }, {})
    await query.bulkDelete('users', { username: ['olliohj', 'newuser1', 'johnsmith', 'jane.madison', 'instruct1', 'timoTekoäly', 'johannakoodari'] }, {})
    await query.bulkDelete('groups', { name: ['ohtuilmo-ryhmä', 'tekOäly-ryhmä'] }, {})
    await query.bulkDelete('group_students', { group_id: [1, 2] }, {})
    await query.bulkDelete('registrations', { student_student_number: ['112345700', '112345701', '112345702', '112345704', '112345705'] }, {})
  }
}
