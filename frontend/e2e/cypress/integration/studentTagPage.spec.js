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
    cy.createGroup({
      name: 'Brand New Group',
      topicId: 1,
      configurationId: 1,
      instructorId: null,
      studentIds: ['012345698'],
    })
    cy.visit('/')
    cy.get('#hamburger-menu-button')
      .click()
      .then(() => {
        cy.contains('Tag management').click()
      })
    cy.get('#tagTitle').type('Coding')
    cy.get('.button').click()
    cy.contains('Coding').should('exist')
    cy.get('#tagTitle').type('Meeting')
    cy.get('.button').click()
    cy.contains('Meeting').should('exist')
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
  })

  beforeEach(() => {
    cy.loginAsRegisteredUser()
    cy.visit('/')
    cy.get('h4', { timeout: 15000 })
      .should('include.text', 'Brand New Group')
      .should('include.text', 'testertester3')
    cy.get('.registration-details-container').should('exist')
  })

  it('student tag page opens', () => {
    cy.get('#hamburger-menu-button')
      .click()
      .then(() => {
        cy.contains('Tags').click()
      })
    cy.contains('Tags').should('exist')
  })

  after(() => {
    cy.deleteAllGroups()
  })
})
