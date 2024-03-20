/* eslint-disable */

describe('Group assignment indicator tests', () => {
  describe('Indicator for unregistered user', () => {
    beforeEach(() => {
      cy.loginAsUnregisteredUser()
      cy.visit('/')
    })

    it('renders "No group assigned" when visited', () => {
      cy.get('[data-cy=groupname_display_unassigned]')
        .should('exist')
        .and('be.visible')
        .and('have.text', 'No group assiged')
    })
  })

  describe('Indicator for registered user', () => {
    before(() => {
      cy.loginAsAdmin()
      cy.createGroup({
        name: 'Indicator Test Group',
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

    it('renders assigned group when visited', () => {
      cy.get('[data-cy=groupname_display_assigned]')
        .should('exist')
        .and('be.visible')
        .and('have.text', 'Indicator Test Group')
    })
  })

  describe('Indicator for admin user', () => {
    beforeEach(() => {
      cy.loginAsAdmin()
      cy.visit('/')
    })

    it('does not render group indicator when visited', () => {
      cy.get('[data-cy=groupname_display_assigned]')
        .should('not.exist')
      cy.get('[data-cy=groupname_display_unassigned]')
        .should('not.exist')
    })
  })
})