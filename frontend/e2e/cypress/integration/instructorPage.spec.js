const initTests = () => {
  cy.createGroup({
    name: 'Tykittelijät',
    topicId: 1,
    configurationId: 1,
    instructorId: '012345688',
    studentIds: ['012345678', '012345698']
  })

  cy.createGroup({
    name: 'Kämmäilijät',
    topicId: 2,
    configurationId: 2,
    instructorId: '012345688',
    studentIds: ['012345678', '012345698']
  })

  const konf1vastaukset1 = {
    peerReviews: [
      {
        user_id: '012345678',
        configuration_id: 1,
        review_round: 1,
        answer_sheet: [
          {
            id: 1,
            type: 'number',
            answer: '3',
            questionHeader: ' Anna tekninen arvosana.'
          },
          {
            id: 2,
            type: 'text',
            answer:
              'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce at.',
            questionHeader: 'Mitä kaikkea teknistä tää jäbä osas tehdä?'
          },
          {
            id: 3,
            type: 'number',
            answer: '2',
            questionHeader: 'Kurssin arvosana'
          },
          {
            id: 4,
            type: 'radio',
            peers: {
              'Donald John Trump': 3,
              'Timo *Teppo Tellervo Testaaja': 1
            },
            questionHeader: 'Miten perustelet tämän arvosanan?'
          }
        ]
      },
      {
        user_id: '012345698',
        configuration_id: 1,
        review_round: 1,
        answer_sheet: [
          {
            id: 1,
            type: 'number',
            answer: '4',
            questionHeader: ' Anna tekninen arvosana.'
          },
          {
            id: 2,
            type: 'text',
            answer:
              'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce at.',
            questionHeader: 'Mitä kaikkea teknistä tää jäbä osas tehdä?'
          },
          {
            id: 3,
            type: 'number',
            answer: '3',
            questionHeader: 'Kurssin arvosana'
          },
          {
            id: 4,
            type: 'radio',
            peers: {
              'Donald John Trump': 2,
              'Timo *Teppo Tellervo Testaaja': 1
            },
            questionHeader: 'Miten perustelet tämän arvosanan?'
          }
        ]
      }
    ]
  }

  const konf1vastaukset2 = {
    peerReviews: [
      {
        user_id: '012345678',
        configuration_id: 1,
        review_round: 2,
        answer_sheet: [
          {
            id: 1,
            type: 'number',
            answer: '3',
            questionHeader: ' Anna tekninen arvosana.'
          },
          {
            id: 2,
            type: 'text',
            answer:
              'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce at.',
            questionHeader: 'Mitä kaikkea teknistä tää jäbä osas tehdä?'
          },
          {
            id: 3,
            type: 'number',
            answer: '2',
            questionHeader: 'Kurssin arvosana'
          },
          {
            id: 4,
            type: 'radio',
            peers: {
              'Donald John Trump': 4,
              'Timo *Teppo Tellervo Testaaja': 4
            },
            questionHeader: 'Miten perustelet tämän arvosanan?'
          }
        ]
      },
      {
        user_id: '012345698',
        configuration_id: 1,
        review_round: 2,
        answer_sheet: [
          {
            id: 1,
            type: 'number',
            answer: '4',
            questionHeader: ' Anna tekninen arvosana.'
          },
          {
            id: 2,
            type: 'text',
            answer:
              'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce at.',
            questionHeader: 'Mitä kaikkea teknistä tää jäbä osas tehdä?'
          },
          {
            id: 3,
            type: 'number',
            answer: '5',
            questionHeader: 'Kurssin arvosana'
          },
          {
            id: 4,
            type: 'radio',
            peers: {
              'Donald John Trump': 5,
              'Timo *Teppo Tellervo Testaaja': 5
            },
            questionHeader: 'Miten perustelet tämän arvosanan?'
          }
        ]
      }
    ]
  }

  const konf2vastaukset1 = {
    peerReviews: [
      {
        user_id: '012345678',
        configuration_id: 2,
        review_round: 1,
        answer_sheet: [
          {
            id: 1,
            type: 'number',
            answer: '0',
            questionHeader: ' Anna tekninen arvosana.'
          },
          {
            id: 2,
            type: 'text',
            answer:
              'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce at.',
            questionHeader: 'Mitä kaikkea teknistä tää jäbä osas tehdä?'
          },
          {
            id: 3,
            type: 'number',
            answer: '0',
            questionHeader: 'Kurssin arvosana'
          },
          {
            id: 4,
            type: 'radio',
            peers: {
              'Donald John Trump': 0,
              'Timo *Teppo Tellervo Testaaja': 0
            },
            questionHeader: 'Miten perustelet tämän arvosanan?'
          }
        ]
      },
      {
        user_id: '012345698',
        configuration_id: 2,
        review_round: 1,
        answer_sheet: [
          {
            id: 1,
            type: 'number',
            answer: '0',
            questionHeader: ' Anna tekninen arvosana.'
          },
          {
            id: 2,
            type: 'text',
            answer:
              'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce at.',
            questionHeader: 'Mitä kaikkea teknistä tää jäbä osas tehdä?'
          },
          {
            id: 3,
            type: 'number',
            answer: '0',
            questionHeader: 'Kurssin arvosana'
          },
          {
            id: 4,
            type: 'radio',
            peers: {
              'Donald John Trump': 0,
              'Timo *Teppo Tellervo Testaaja': 0
            },
            questionHeader: 'Miten perustelet tämän arvosanan?'
          }
        ]
      }
    ]
  }

  cy.createPeerReviews(konf1vastaukset1)
  cy.createPeerReviews(konf1vastaukset2)
  cy.createPeerReviews(konf2vastaukset1)
}

describe('Instructor review page', () => {
  before(() => {
    initTests()
  })

  beforeEach(() => {
    cy.loginAsAdmin()
    cy.visit('/instructorpage')
  })

  it('Starting testing', () => {
    // submit not successfull, still on same page
    cy.url().should('contain', '/instructorpage')
    cy.contains('Tykittelijät')
    cy.contains('2.50')
  })

  it('Change configuration twice', () => {
    // submit not successfull, still on same page
    cy.get('[data-cy=configuration-selector]').click()
    cy.get('.configuration-menu-item')
      .contains('Konfiguraatio 2')
      .click()
    cy.contains('Kämmäilijät')
    cy.contains(
      'This group hasn\'t answered to the second peer review round yet.'
    )
    cy.get('[data-cy=configuration-selector]').click()
    cy.get('.configuration-menu-item')
      .contains('Konfiguraatio 1')
      .click()
    cy.contains('4.50')
  })

  after(() => {
    cy.deleteAllGroups()
    cy.deleteAllPeerReviews()
  })
})
