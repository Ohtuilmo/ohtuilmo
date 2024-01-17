const initTests = () => {
  cy.createGroup({
    name: 'Tykittelijät',
    topicId: 1,
    configurationId: 1,
    instructorId: '012345688',
    studentIds: ['012345678', '012345698']
  })
}
const submitInstructorReview = () => {
  cy.get('[data-cy="submit-instructor-review-button"]').click()
}

const answerTextInput = (text, index) => {
  cy.get(`[data-cy="textInput- Osasko jaba tykitella. user:${index}"]`).within(
    () => {
      cy.get('textarea').type(text)
    }
  )
}
const answerNumberInput = (number, index) => {
  cy.get(`[data-cy="numberInput- Anna tekninen arvosana. user:${index}"]`)
    .clear()
    .type(number)
}

const expectNotification = (text) => {
  cy.get('.notification').should('be.text', text)
}

describe.skip('Instructor review page', () => {
  before(() => {
    initTests()
  })

  beforeEach(() => {
    cy.loginAsAdmin()
    cy.deleteInstructorReviews()
    cy.visit('/instructorreviewpage')
  })

  it('requires text fields to be filled', () => {
    submitInstructorReview()
    // submit not successfull, still on same page
    cy.url().should('contain', '/instructorreviewpage')
    expectNotification('You must answer all questions')
  })

  it('shows error when text fields are under 5 characters long', () => {
    answerTextInput('foo', 0)
    submitInstructorReview()
    expectNotification('Text answers must be over 5 characters long.')
  })

  it('shows error when text fields are filled but there are other unfilled fields', () => {
    answerTextInput(
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce at.',
      0
    )
    submitInstructorReview()
    expectNotification('You must answer all questions')
  })

  it('shows error when number fields are filled but are higher than 5', () => {
    answerTextInput(
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce at.',
      0
    )
    answerNumberInput(6, 0)
    submitInstructorReview()
    expectNotification('Grade can not be over 5.')
  })

  it('shows error when number fields are filled but are lower than 5', () => {
    answerTextInput(
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce at.',
      0
    )
    answerNumberInput(-1, 0)
    submitInstructorReview()
    expectNotification('Number answer can not be negative')
  })

  it('submits instructor review when all fields are filled', () => {
    answerTextInput(
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce at.',
      0
    )
    answerTextInput(
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce at.',
      1
    )
    answerNumberInput(5, 0)
    answerNumberInput(0, 1)
    submitInstructorReview()
    expectNotification('Instructor review saved!')
    cy.contains('You have reviewed every group you are instructing.')
  })

  after(() => {
    cy.deleteAllGroups()
  })
})
