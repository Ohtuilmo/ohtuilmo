describe('Review-questions page', () => {
  beforeEach(() => {
    cy.loginAsAdmin()
    cy.visit('/administration/configuration')
    cy.deleteReviewQuestions()
    cy.createReviewQuestionSet('Super nice review questions', [
      {
        type: 'info',
        header: 'This is info',
        description: 'Just fill the form'
      },
      {
        header: 'Previous experiene in software developemnt',
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
  })

  it('is on adminstration page', () => {
    cy.get('.admin-page-container').contains('Change configuration')
  })
  it('new review question set is visible for round 1', () => {
    cy.get('[data-cy=expansion-review-questions-1]').click()
    cy.get('[data-cy=select-review-questions-1]').click()
    cy.get('[data-cy=menu-item-review-questions-1]').click()
    cy.get('.admin-page-container').contains('Super nice review questions')
  })
  it('new review question is shown when it is selected', () => {
    cy.get('[data-cy=expansion-review-questions-1]').click()
    cy.get('[data-cy=select-review-questions-1]').click()
    cy.get('[data-cy=menu-item-review-questions-1]').click()
    cy.get('.admin-page-container').contains('This is info')
  })
})
