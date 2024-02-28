describe('Answering peer review', () => {
  before(() => {

  })

  it.only('login as admin', () => {
    cy.loginAsAdmin()
    cy.wait(1000)
    cy.visit('/')
    cy.wait(1000)
  })

  after(() => {

  })
})
