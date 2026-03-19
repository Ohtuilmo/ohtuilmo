const addWeeksToDate = (date, weeks) => {
  const newDate = new Date(date)
  newDate.setDate(newDate.getDate() + weeks * 7)
  return newDate
}

const addDaysToDate = (date, days) => {
  const newDate = new Date(date)
  newDate.setDate(newDate.getDate() + days)
  return newDate
}

const formatDate = (date) => date.toISOString().slice(0, 10)

describe('Student tag page', () => {
  before(() => {
    cy.deleteAllGroups()
    cy.loginAsAdmin()
    cy.visit('/')
    cy.createTag('Coding')
    cy.createTag('Meeting')
    cy.createGroup({
      name: 'Brand New Group',
      topicId: 1,
      configurationId: 1,
      instructorId: null,
      studentIds: ['012345698'],
    }).then((createdGroup) => {
      cy.loginAsRegisteredUser()
      cy.visit('/')

      const dateToday = new Date()
      const dateYesterday = addDaysToDate(dateToday, -1)

      cy.createSprint({
        sprint: 0,
        start_date: formatDate(addWeeksToDate(dateYesterday, -1)),
        end_date: formatDate(dateYesterday),
      })
      cy.createSprint({
        sprint: 1,
        start_date: formatDate(dateToday),
        end_date: formatDate(addWeeksToDate(dateToday, 1)),
      })

      cy.addTimelogEntry({
        studentNumber: '012345698',
        sprint: 0,
        date: formatDate(dateYesterday),
        minutes: 120,
        description: 'Coding with team',
        tags: ['Coding'],
        groupId: createdGroup.id,
      })
      cy.addTimelogEntry({
        studentNumber: '012345698',
        sprint: 0,
        date: formatDate(dateYesterday),
        minutes: 180,
        description: 'Customer meeting',
        tags: ['Meeting'],
        groupId: createdGroup.id,
      })
    })
  })

  beforeEach(() => {
    cy.loginAsRegisteredUser()
    cy.visit('/')
    cy.get('h4', { timeout: 15000 })
      .should('include.text', 'Brand New Group')
      .should('include.text', 'testertester3')
    cy.get('.registration-details-container').should('exist')
    cy.get('#hamburger-menu-button')
      .click()
      .then(() => {
        cy.contains('Tags').click()
      })
    // Ignore ResizeObserver loop limit error which happens randomly
    cy.on(
      'uncaught:exception',
      (err) => !err.message.includes('ResizeObserver loop'),
    )
  })

  it('student tag page opens', () => {
    cy.contains('Tags').should('exist')
  })

  it('student can see all available tags', () => {
    cy.contains('Coding').should('exist')
    cy.contains('Meeting').should('exist')
  })

  after(() => {
    cy.deleteAllGroups()
    cy.deleteAllTags()
  })
})
