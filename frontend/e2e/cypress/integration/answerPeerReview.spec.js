describe('Answering peer review', () => {
  before(() => {
    cy.loginAsAdmin()
    cy.deleteReviewQuestions()
    cy.deleteAllGroups()
    cy.deleteAllPeerReviews()
    cy.createGroup({
      name: 'The group of the groups',
      topicId: 1,
      configurationId: 1,
      instructorId: null,
      studentIds: ['012345678', '012345698']
    })
    cy.createReviewQuestionSet('Super nice review questions', [
      {
        type: 'info',
        header: 'This is info',
        description: 'Just fill the form'
      },
      {
        header: 'Previous experiene in software developement',
        description: 'How many hours?',
        type: 'number'
      },
      {
        header: 'Without option?',
        description: '',
        type: 'number'
      },
      {
        header: 'Ok and with option',
        description: 'Choose a radio button you want',
        type: 'radio',
        options: ['Cant say', 'Not at all', 'Little', 'Decent', 'Good', 'Super']
      }
    ])
    cy.setPeerReviewOneActive(
      'Konfiguraatio 1',
      1,
      'Super nice review questions'
    )
  })

  it('peer review is open', () => {
    cy.loginAsRegisteredUser()
    cy.visit('/peerreview')
    cy.get('.peer-review-container').contains('This is info')
  })

  it('shows an error if none of the fields is filled', () => {
    cy.loginAsRegisteredUser()
    cy.visit('/peerreview')
    cy.contains('Submit').click()
    cy.contains('You must answer all questions')
  })

  it('shows an error if only one of the fields is filled', () => {
    cy.loginAsRegisteredUser()
    cy.visit('/peerreview')
    cy.get(
      '[data-cy="input_number_Previous experiene in software developement"]'
    )
      .type('{backspace}')
      .type('123')
    cy.contains('Submit').click()
    cy.contains('You must answer all questions')
  })

  it('shows an error if not all of the radio button questions is answered', () => {
    cy.loginAsRegisteredUser()
    cy.visit('/peerreview')
    cy.get(
      '[data-cy="input_number_Previous experiene in software developement"]'
    )
      .type('{backspace}')
      .type('123')
    cy.get('[data-cy="input_number_Without option?"]')
      .type('{backspace}')
      .type('123')
    cy.get('[name="Ok and with optionTimo *Teppo Tellervo Testaaja"]')
      .eq(3)
      .click()
    cy.contains('Submit').click()
    cy.contains('You must answer all questions')
  })

  it('shows a submit confimation when all field and butotns are filled properly', () => {
    cy.loginAsRegisteredUser()
    cy.visit('/peerreview')
    cy.get(
      '[data-cy="input_number_Previous experiene in software developement"]'
    )
      .type('{backspace}')
      .type('123')
    cy.get('[data-cy="input_number_Without option?"]')
      .type('{backspace}')
      .type('123')
    cy.get('[name="Ok and with optionTimo *Teppo Tellervo Testaaja"]')
      .eq(2)
      .click()
    cy.get('[name="Ok and with optionDonald John Trump"]')
      .eq(5)
      .click()
    cy.contains('Submit').click()
    cy.contains('Peer review saved!')
  })

  after(() => {
    cy.deleteAllGroups()
    cy.deleteAllPeerReviews()
  })
})
