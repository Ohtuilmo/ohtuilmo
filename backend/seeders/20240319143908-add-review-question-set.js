'use strict'

const initialQuestionsWithAnswers = [
  {
    Header: 'Kuinka monta tuntia käytit projektin parissa?',
    Description: 'Arvioi käyttämäsi aika tunteina.',
    Type: 'number'
  },
  {
    Header: 'Tiimin jäsenten tekninen kontribuutio',
    Type: 'radio',
    Options: [1, 2, 3, 4, 5]
  },
  {
    Header: 'Tiimin yhteistyön arviointi',
    Description: 'Arvioi sanallisesti tiimin yhteistyötä ja kommunikaatiota.',
    Type: 'text'
  },
]

const initialReviewQuestionSet = [
  {
    name: 'Review 1',
    questions: JSON.stringify(
      initialQuestionsWithAnswers.map((item) => {
        return {
          header: item.Header,
          description: item.Description,
          type: item.Type,
          options: item.Options
        }
      })
    )
  }
]

const initialPeerReviewAnswers1 =[
  {
    "id": 0,
    "type": "number",
    "answer": "20",
    "questionHeader": "Kuinka monta tuntia käytit projektin parissa?"
  },
  {
    "id": 1,
    "type": "radio",
    "peers": {"New User": 2, "John Smith": 3, "Jane Madison": 4},
    "questionHeader": "Tiimin jäsenten tekninen kontribuutio"
  },
  {
    "id": 2,
    "type": "text",
    "answer": "Hyvä tiimi, mutta kommunikaatio voisi olla selkeämpää. Tiimin jäsenet olivat kuitenkin aktiivisia ja osallistuivat.",
    "questionHeader": "Tiimin yhteistyön arviointi"
  }
]

const initialPeerReviewAnswers2 =[
  {
    "id": 0,
    "type": "number",
    "answer": "35",
    "questionHeader": "Kuinka monta tuntia käytit projektin parissa?"
  },
  {
    "id": 1,
    "type": "radio",
    "peers": {"New User": 5, "John Smith": 4, "Jane Madison": 1},
    "questionHeader": "Tiimin jäsenten tekninen kontribuutio"
  },
  {
    "id": 2,
    "type": "text",
    "answer": "En osaa sanoa, kirjoittamminen on minulle välillä vaikeaa. Ihan kivat tyypit, jaksoin tulla paikalle.",
    "questionHeader": "Tiimin yhteistyön arviointi"
  }
]

const InitialPeerReview = [
  {
    user_id: 112345701,
    configuration_id: 1,
    review_round: 1,
    answer_sheet: JSON.stringify(initialPeerReviewAnswers1)
  },
  {
    user_id: 112345702,
    configuration_id: 1,
    review_round: 1,
    answer_sheet: JSON.stringify(initialPeerReviewAnswers2)
  },
]

const InitialInstructorReview = [
  {
    user_id: 112345699,
    answer_sheet: JSON.stringify({
      group_id: 1,
      group_name: 'ohtuilmo-ryhmä',
      answer_sheet: [
        {
          name: {
            last_name: 'User',
            first_names: 'New'
          },
          answers: [
            { type: 'info', header: 'Tekninen kontribuutio', description: '' },
            { id: 1, type: 'text', answer: 'Tässä pitäisi olla vertaisarvion arvosanat ja keskiarvo', header: 'Vertaisarvion arvosanat ja keskiarvo' },
            { id: 2, type: 'text', answer: 'Tässä pitäisi olla Poimintoja sanallisista vertaisarvioista', header: 'Poimintoja sanallisista vertaisarvioista' },
            { id: 3, type: 'text', answer: 'Tässä pitäisi olla Ohjaajan kommentit', header: 'Ohjaajan kommentit' },
            { id: 4, type: 'number', answer: '5', header: 'Tekninen kontribuutio: arvosana' },
            { type: 'info', header: 'Prosessin noudattaminen', description: '' },
            { id: 6, type: 'text', answer: 'Tässä pitäisi olla vertaisarvion arvosanat ja keskiarvo', header: 'Vertaisarvion arvosanat ja keskiarvo' },
            { id: 7, type: 'text', answer: 'Tässä pitäisi olla Poimintoja sanallisista vertaisarvioista', header: 'Poimintoja sanallisista vertaisarvioista' },
            { id: 8, type: 'text', answer: 'Tässä pitäisi olla Ohjaajan kommentit', header: 'Ohjaajan kommentit' },
            { id: 9, type: 'number', answer: '4', header: 'Prosessin noudattaminen: arvosana' },
            { type: 'info', header: 'Prosessin kehittäminen', description: '' },
            { id: 11, type: 'text', answer: 'Tässä pitäisi olla vertaisarvion arvosanat ja keskiarvo', header: 'Vertaisarvion arvosanat ja keskiarvo' },
            { id: 12, type: 'text', answer: 'Tässä pitäisi olla Poimintoja sanallisista vertaisarvioista', header: 'Poimintoja sanallisista vertaisarvioista' },
            { id: 13, type: 'text', answer: 'Tässä pitäisi olla Ohjaajan kommentit', header: 'Ohjaajan kommentit' },
            { id: 14, type: 'number', answer: '3', header: 'Prosessin kehittäminen: arvosana' },
            { type: 'info', header: 'Ryhmätyöskentely', description: '' },
            { id: 16, type: 'text', answer: 'Tässä pitäisi olla vertaisarvion arvosanat ja keskiarvo', header: 'Vertaisarvion arvosanat ja keskiarvo' },
            { id: 17, type: 'text', answer: 'Tässä pitäisi olla Poimintoja sanallisista vertaisarvioista', header: 'Poimintoja sanallisista vertaisarvioista' },
            { id: 18, type: 'text', answer: 'Tässä pitäisi olla Ohjaajan kommentit', header: 'Ohjaajan kommentit' },
            { id: 19, type: 'number', answer: '2', header: 'Ryhmätyöskentely: arvosana' },
            { type: 'info', header: 'Asiakastyöskentely', description: '' },
            { id: 21, type: 'text', answer: 'Tässä pitäisi olla vertaisarvion arvosanat ja keskiarvo', header: 'Vertaisarvion arvosanat ja keskiarvo' },
            { id: 22, type: 'text', answer: 'Tässä pitäisi olla Poimintoja sanallisista vertaisarvioista', header: 'Poimintoja sanallisista vertaisarvioista' },
            { id: 23, type: 'text', answer: 'Tässä pitäisi olla Ohjaajan kommentit', header: 'Ohjaajan kommentit' },
            { id: 24, type: 'number', answer: '1', header: 'Asiakastyöskentely: arvosana' },
            { type: 'info', header: 'Koko projekti', description: '' },
            { id: 26, type: 'number', answer: '3', header: 'arvosana' }
          ]
        },
        {
          name: {
            last_name: 'Smith',
            first_names: 'John'
          },
          answers: [
            { type: 'info', header: 'Tekninen kontribuutio', description: '' },
            { id: 1, type: 'text', answer: 'Tässä pitäisi olla vertaisarvion arvosanat ja keskiarvo', header: 'Vertaisarvion arvosanat ja keskiarvo' },
            { id: 2, type: 'text', answer: 'Tässä pitäisi olla Poimintoja sanallisista vertaisarvioista', header: 'Poimintoja sanallisista vertaisarvioista' },
            { id: 3, type: 'text', answer: 'Tässä pitäisi olla Ohjaajan kommentit', header: 'Ohjaajan kommentit' },
            { id: 4, type: 'number', answer: '2', header: 'Tekninen kontribuutio: arvosana' },
            { type: 'info', header: 'Prosessin noudattaminen', description: '' },
            { id: 6, type: 'text', answer: 'Tässä pitäisi olla vertaisarvion arvosanat ja keskiarvo', header: 'Vertaisarvion arvosanat ja keskiarvo' },
            { id: 7, type: 'text', answer: 'Tässä pitäisi olla Poimintoja sanallisista vertaisarvioista', header: 'Poimintoja sanallisista vertaisarvioista' },
            { id: 8, type: 'text', answer: 'Tässä pitäisi olla Ohjaajan kommentit', header: 'Ohjaajan kommentit' },
            { id: 9, type: 'number', answer: '2', header: 'Prosessin noudattaminen: arvosana' },
            { type: 'info', header: 'Prosessin kehittäminen', description: '' },
            { id: 11, type: 'text', answer: 'Tässä pitäisi olla vertaisarvion arvosanat ja keskiarvo', header: 'Vertaisarvion arvosanat ja keskiarvo' },
            { id: 12, type: 'text', answer: 'Tässä pitäisi olla Poimintoja sanallisista vertaisarvioista', header: 'Poimintoja sanallisista vertaisarvioista' },
            { id: 13, type: 'text', answer: 'Tässä pitäisi olla Ohjaajan kommentit', header: 'Ohjaajan kommentit' },
            { id: 14, type: 'number', answer: '3', header: 'Prosessin kehittäminen: arvosana' },
            { type: 'info', header: 'Ryhmätyöskentely', description: '' },
            { id: 16, type: 'text', answer: 'Tässä pitäisi olla vertaisarvion arvosanat ja keskiarvo', header: 'Vertaisarvion arvosanat ja keskiarvo' },
            { id: 17, type: 'text', answer: 'Tässä pitäisi olla Poimintoja sanallisista vertaisarvioista', header: 'Poimintoja sanallisista vertaisarvioista' },
            { id: 18, type: 'text', answer: 'Tässä pitäisi olla Ohjaajan kommentit', header: 'Ohjaajan kommentit' },
            { id: 19, type: 'number', answer: '4', header: 'Ryhmätyöskentely: arvosana' },
            { type: 'info', header: 'Asiakastyöskentely', description: '' },
            { id: 21, type: 'text', answer: 'Tässä pitäisi olla vertaisarvion arvosanat ja keskiarvo', header: 'Vertaisarvion arvosanat ja keskiarvo' },
            { id: 22, type: 'text', answer: 'Tässä pitäisi olla Poimintoja sanallisista vertaisarvioista', header: 'Poimintoja sanallisista vertaisarvioista' },
            { id: 23, type: 'text', answer: 'Tässä pitäisi olla Ohjaajan kommentit', header: 'Ohjaajan kommentit' },
            { id: 24, type: 'number', answer: '1', header: 'Asiakastyöskentely: arvosana' },
            { type: 'info', header: 'Koko projekti', description: '' },
            { id: 26, type: 'number', answer: '3', header: 'arvosana' }
          ]
        }
      ]
    })
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
    await query.bulkInsert('review_question_sets', addTimeStamps(initialReviewQuestionSet), {})
    await query.bulkInsert('peer_reviews', addTimeStamps(InitialPeerReview), {})
    await query.bulkUpdate('configurations', { review_question_set1_id: 1 }, { id: 1 } )
    await query.bulkInsert('instructor_reviews', addTimeStamps(InitialInstructorReview), {})
  },

  down: async (query) => {
    await query.bulkDelete('review_question_sets', null, {})
    await query.bulkDelete('peer_reviews', null, {})
    await query.bulkUpdate('configurations', { review_question_set1_id: null }, { id: 1 } )
    await query.bulkDelete('instructor_reviews', null, {})
  }
}