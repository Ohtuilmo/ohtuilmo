/* eslint-disable */
import { addWeeksToDate, addDaysToDate } from '../../../src/utils/functions'

const formatDate = (date) => date.toISOString().slice(0, 10)

describe('Time logs & sprints', () => {
  before(() => {
    cy.loginAsAdmin()
    cy.createGroup({
      name: 'Brand New Group',
      topicId: 1,
      configurationId: 1,
      instructorId: null,
      studentIds: ['012345698'],
    })
  })

  beforeEach(() => {
    cy.loginAsRegisteredUser()
    cy.visit('/')
  })

  it('add 2 sprints', () => {
    cy.get('#hamburger-menu-button')
      .click()
      .then(() => {
        cy.contains('Sprint Dashboard').click()
      })

    const dateToday = new Date()
    const dateYesterday = addDaysToDate(dateToday, -1)

    cy.get('#sprintNumber').type('1')
    cy.get('#startDate').type(formatDate(addWeeksToDate(dateYesterday, -1)))
    cy.get('#endDate').type(formatDate(dateYesterday))
    cy.get('#add-sprint-button').click()

    cy.get('#sprintNumber').type('2')
    cy.get('#startDate').type(formatDate(dateToday))
    cy.get('#endDate').type(formatDate(addWeeksToDate(dateToday, 1)))
    cy.get('#add-sprint-button').click()
  })

  it('renders current sprint by default', () => {
    cy.get('#hamburger-menu-button')
      .click()
      .then(() => {
        cy.contains('Time Log').click()
      })

    cy.get('.timelogs-sprint-select').contains('SPRINT 2')
  })

  it('time log form is disabled for previous sprint', () => {
    cy.get('#hamburger-menu-button')
      .click()
      .then(() => {
        cy.contains('Time Log').click()
      })

    cy.get('#previous-sprint-button').click()
    cy.get('#date').should('be.disabled')
    cy.get('#time').should('be.disabled')
    cy.get('#description').should('be.disabled')
    cy.get('#time-log-submit-button').should('be.disabled')
  })

  it('add 2 time logs', () => {
    cy.get('#hamburger-menu-button')
      .click()
      .then(() => {
        cy.contains('Time Log').click()
      })

    cy.get('#date').type(formatDate(new Date()))
    cy.get('#time').type('01:00')
    cy.get('#description').type('test description 1')
    cy.get('#time-log-submit-button').click()

    cy.get('#date').type(formatDate(addDaysToDate(new Date(), 1)))
    cy.get('#time').type('02:00')
    cy.get('#description').type('test description 2')
    cy.get('#time-log-submit-button').click()

    cy.get('.notification').should('exist')
    cy.get('.notification').should('have.text', 'Time log created successfully')
  })

  it('should display 2 time logs', () => {
    cy.get('#hamburger-menu-button')
      .click()
      .then(() => {
        cy.contains('Time Log').click()
      })
    cy.get('.timelogs-container-1').should('contain', 'test description 1')
    cy.get('.timelogs-container-1').should('contain', 'test description 2')

    cy.get('#timelog-rows').children().should('have.length', 2)
  })

  // this test will fail when frontend validation is done properly, remove at that point
  it('shows error from backend when creating timeLog fails too short description', () => {
    cy.visit('/timelogs')
    cy.get('.timelogs-container-1').should('exist')
    cy.get('.input-container').should('exist')
    cy.get('.date').type('2022-01-01')
    cy.get('.time').type('01:00')
    cy.get('.description').type('inv')
    cy.get('.submit-button').click()

    cy.get('.notification').should('exist')
    cy.get('.notification').should(
      'have.text',
      'Description must be over 5 characters.'
    )
  })

  it('shows error from backend when creating timeLog fails with data outside sprint', () => {
    cy.visit('/timelogs')
    cy.get('.timelogs-container-1').should('exist')
    cy.get('.input-container').should('exist')
    cy.get('.date').type('2022-02-01')
    cy.get('.time').type('01:00')
    cy.get('.description').type('valid description')
    cy.get('.submit-button').click()

    cy.get('.notification').should('exist')
    cy.get('.notification').should(
      'have.text',
      'The log date is not within sprint start and end date.'
    )
  })

  it('previous week should not display time logs', () => {
    cy.get('#hamburger-menu-button')
      .click()
      .then(() => {
        cy.contains('Time Log').click()
      })
    cy.get('.timelogs-container-1').should('contain', 'test description 2')
    cy.get('#previous-sprint-button').click()
    cy.get('#timelog-rows').children().should('have.length', 1)
    cy.get('#timelog-rows').should('contain', 'No logs yet :(')
  })

  it('remove a time log, should not display removed time log', () => {
    cy.get('#hamburger-menu-button')
      .click()
      .then(() => {
        cy.contains('Time Log').click()
      })

    cy.get(':nth-child(1) > .timelogs-description')
      .invoke('text')
      .as('removedLogDescription')

    cy.get('#timelog-rows > :nth-child(1)')
      .find('[id^="timelog-remove-button-"]')
      .click()

    cy.get('@removedLogDescription').then((removedLogDescription) => {
      cy.get('#timelog-rows > :nth-child(1) > .timelogs-description').should(
        'not.contain',
        removedLogDescription
      )
    })

    cy.get('#timelog-rows').children().should('have.length', 1)
  })

  it('remove sprints, should not display sprints or time logs', () => {
    cy.get('#hamburger-menu-button')
      .click()
      .then(() => {
        cy.contains('Sprint Dashboard').click()
      })

    cy.get('.sprints-container')
      .find('[id^="sprint-remove-button-"]')
      .click({ multiple: true })
      .then(() =>
        cy.get('#app-content').should('not.contain', '.sprint-list-container')
      )

    cy.get('#hamburger-menu-button')
      .click()
      .then(() => {
        cy.contains('Time Log').click()
      })

    cy.get('#app-content').should(
      'contain',
      'Your group has no sprints. Add a sprint using Sprint Dashboard.'
    )
  })

  after(() => {
    cy.deleteAllGroups()
  })
})
