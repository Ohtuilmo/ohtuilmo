/* eslint-disable */

const initTests = () => {
  cy.deleteAllGroups()
  return cy.createGroup({
    name: 'Tykittelijät',
    topicId: 1,
    configurationId: 1,
    instructorId: '012345688',
    studentIds: ['012345678', '012345698'],
  })
}
const submitInstructorReview = () => {
  cy.get('[data-cy="submit-instructor-review-button"]').click()
}

const answerTextInput = (text, index) => {
  cy.get(`[data-cy="textInput-Vertaisarvion arvosanat ja keskiarvo user:${index}"]`).first().within(
    () => {
      cy.get('textarea')
        // .clear()
        .type(text)
    }
  )
}
const answerNumberInput = (number, index) => {
  cy.get(`[data-cy="numberInput-Tekninen kontribuutio: arvosana user:${index}"]`)
    .clear()
    .type(number)
}

const fillRemainingFields = (text, number, index) => {
  const textFieldNames = [
    "Vertaisarvion arvosanat ja keskiarvo",
    "Poimintoja sanallisista vertaisarvioista",
    "Ohjaajan kommentit",
  ]
  const numberFieldNames = [
    "Tekninen kontribuutio: arvosana",
    "Prosessin noudattaminen: arvosana",
    "Prosessin kehittäminen: arvosana",
    "Ryhmätyöskentely: arvosana",
    "Asiakastyöskentely: arvosana",
    "arvosana"
  ]


  // Without this the test doesn't work
  // if /api/instructorreview/getAllAnsweredGroupId
  // resolves during execution, filled textboxes reset
  cy.wait(5000)
  textFieldNames.forEach(field => {
    cy.get(`[data-cy="textInput-${field} user:${index}"]`).each($el => {
      cy.wait(50)
      cy.wrap($el).find("textarea").type(text)
    })
  })
  numberFieldNames.forEach(field => {
    cy.get(`[data-cy="numberInput-${field} user:${index}"]`)
    .clear()
    .type(number)
  })
}

const expectNotification = (text) => {
  cy.get('.notification').should('be.text', text)
}

describe('Instructor review page', () => {
  before(() => {
    initTests()
  })

  beforeEach(() => {
    cy.loginAsAdmin()
    cy.deleteInstructorReviews()
    cy.visit('/instructorreviewpage')
  })

  it('shows the correct students to give reviews for', () => {
    cy.wait(1000)
    cy.get("h2").should('contain', "Timo *Teppo Tellervo Testaaja")
    cy.get("h2").should('contain', "Donald John Trump")
  })

  it('requires text fields to be filled', () => {
    submitInstructorReview()
    // submit not successfull, still on same page
    cy.url().should('contain', '/instructorreviewpage')
    expectNotification('You must answer all questions')
  })

  it('shows error when text fields are under 5 characters long', () => {
    cy.contains("Timo *Teppo Tellervo Testaaja", { timeout: 10000 }).first().click()
    answerTextInput('foo', 0)

    submitInstructorReview()
    expectNotification('Text answers must be over 5 characters long.')
  })

  it('shows error when text fields are filled but there are other unfilled fields', () => {
    cy.contains("Timo *Teppo Tellervo Testaaja", { timeout: 10000 }).first().click()
    answerTextInput(
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce at.',
      0
    )

    submitInstructorReview()
    expectNotification('You must answer all questions')
  })

  it('shows error when number fields are filled but are higher than 5', () => {
    cy.contains("Timo *Teppo Tellervo Testaaja", { timeout: 10000 }).first().click()
    fillRemainingFields("Lorem ipsum", 3, 0)
    answerNumberInput(6, 0)

    cy.contains("Donald John Trump").first().click()
    fillRemainingFields("Lorem ipsum", 3, 1)

    submitInstructorReview()
    expectNotification('Grade can not be over 5.')
  })

  it('shows error when number fields are filled but are lower than 5', () => {
    cy.contains("Timo *Teppo Tellervo Testaaja", { timeout: 10000 }).first().click()

    fillRemainingFields("Lorem ipsum", 3, 0)
    answerNumberInput(-1, 0)

    cy.contains("Donald John Trump").first().click()
    fillRemainingFields("Lorem ipsum", 3, 1)

    submitInstructorReview()
    expectNotification('Number answer can not be negative')
  })

  it('submits instructor review when all fields are filled', () => {
    cy.contains("Timo *Teppo Tellervo Testaaja").first().click()
    fillRemainingFields("Lorem ipsum", 5, 0)

    cy.contains("Donald John Trump").first().click()
    fillRemainingFields("Lorem ipsum", 3, 1)

    submitInstructorReview()

    expectNotification('Instructor review saved!')
    cy.contains('You have reviewed every group you are instructing.')
  })

  after(() => {
    cy.deleteAllGroups()
  })
})
