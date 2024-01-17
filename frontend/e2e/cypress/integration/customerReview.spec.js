const initTests = () => {
  cy.deleteCustomerReviewQuestions()
  cy.createCustomerReviewQuestionSet('Asiakkaan arviosetti 1', [
    {
      type: 'text',
      header: 'Mitä mieltä olit tykittelystä?',
      description: 'Vastaa lyhyesti 5000 merkillä'
    },
    {
      type: 'oneliner',
      header: 'Minne spämmi?',
      description: 'Max 7 päivässä.'
    },
    {
      type: 'number',
      header: 'Monta tuntia viikossa olit yhteydessä tiimiin?'
    },
    {
      type: 'range',
      header: 'Minkä arvosanan antaisit tiimille?',
      description: 'Pienet epätykittelyt on ihan ok',
      options: ['1', '2', '3', '4', '5']
    }
  ])
  cy.createGroup({
    name: 'Tykittelijät',
    topicId: 1,
    configurationId: 1,
    instructorId: '012345698',
    studentIds: ['012345678', '012345688']
  })

  cy.setCustomerReviewQuestionSetToConfiguration(1)
}

const submitCustomerReview = () => {
  cy.get('[data-cy="submit-customer-review-button"]').click()
}

const answerTextInput = (text) => {
  cy.get('[data-cy="textInput-Mitä mieltä olit tykittelystä?"]').within(() => {
    cy.get('textarea').type(text)
  })
}

const answerOnelinerInput = (text) => {
  cy.get('[data-cy="onelinerInput-Minne spämmi?"]').within(() => {
    cy.get('input').type(text)
  })
}

const answerNumberInput = (number) => {
  cy.get(
    '[data-cy="numberInput-Monta tuntia viikossa olit yhteydessä tiimiin?"]'
  )
    .clear()
    .type(number)
}

const answerRangeInput = (number) => {
  cy.get('[data-cy="rangeInput-Minkä arvosanan antaisit tiimille?"]').within(
    () => {
      cy.get('input')
        .eq(number - 1)
        .click()
    }
  )
}

const expectNotification = (text) => {
  cy.get('.notification').should('be.text', text)
}

describe('Customer review page', () => {
  before(() => {
    initTests()
  })

  beforeEach(() => {
    cy.deleteCustomerReviews()
    cy.visit('/customer-review/eec0neeT0jo0ae9F')
  })

  it('requires text fields to be filled', () => {
    submitCustomerReview()
    // submit not successfull, still on same page
    cy.url().should('contain', '/customer-review/eec0neeT0jo0ae9F')
    cy.contains('Customer review')
  })

  it('shows error when text fields are under 5 characters long', () => {
    answerTextInput('foo')
    answerOnelinerInput('spammiosoite')
    submitCustomerReview()
    expectNotification('Text answers must be over 5 characters long.')
  })

  it('shows error when oneliner fields are under 5 characters long', () => {
    answerTextInput(
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce at.'
    )
    answerOnelinerInput('spam')
    submitCustomerReview()
    expectNotification('Short text answers must be over 5 characters long.')
  })

  it('shows error when text fields are filled but there are other unfilled fields', () => {
    answerTextInput(
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce at.'
    )
    answerOnelinerInput('spammiosoite')
    submitCustomerReview()
    expectNotification('You must answer all questions')
  })

  it('submits customer review when all fields are filled', () => {
    answerTextInput(
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce at.'
    )
    answerNumberInput(1337)
    answerRangeInput(3)
    answerOnelinerInput('spammittanne@helsinki.foo')
    submitCustomerReview()
    expectNotification('Review saved!')
    cy.contains('Thank you for the review')
  })

  after(() => {
    cy.deleteAllGroups()
    cy.deleteCustomerReviews()
  })
})
