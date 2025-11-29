/* eslint-disable */

const assertIsOnLandingPage = () => {
  cy.get('[data-cy=registrationlink]').should('be.visible')
}

const assertIsUnauthorized = () => {
  cy.get("[class=unauthorized-page]").should('be.visible')
  cy.contains("Unauthorized.")
}

const assertIsOnLoginPage = () => {
  cy.url().should('include', '/login')
  cy.contains('Software engineering project')
  cy.get('.loginpage-header').should('have.text', 'Login')
}

const assertIsOnRegistrationDetailsPage = () => {
  cy.url().should('include', '/registrationdetails')
  cy.contains('Registration details')
  cy.get('.registration-details-container').should('be.visible')
}

const assertIsAlreadyRegistered = () => {
  cy.url().should('include', '/register')
  cy.contains('You have already registered to current project')
}

describe('Page access and redirect tests', () => {
  describe('Page access for user', () => {
    beforeEach(() => {
      cy.loginAsUnregisteredUser()
      cy.visit('/')
    })

    it('/administration/configuration redirects user to landing page', () => {
      cy.visit('/administration/configuration')
      assertIsUnauthorized()
    })

    it('/administration/customer-review-questions redirects user to landing page', () => {
      cy.visit('/administration/customer-review-questions')
      assertIsUnauthorized()
    })

    it('/administration/groups redirects user to landing page', () => {
      cy.visit('/administration/groups')
      assertIsUnauthorized()
    })

    it('/administration/participants redirects user to landing page', () => {
      cy.visit('/administration/participants')
      assertIsUnauthorized()
    })

    it('/administration/peer-review-questions redirects user to landing page', () => {
      cy.visit('/administration/peer-review-questions')
      assertIsUnauthorized()
    })

    it('/administration/registration-questions redirects user to landing page', () => {
      cy.visit('/administration/registration-questions')
      assertIsUnauthorized()
    })

    it('/administration/registrationmanagement redirects user to landing page', () => {
      cy.visit('/administration/registrationmanagement')
      assertIsUnauthorized()
    })

    it('/administration/email-templates redirects user to login page', () => {
      cy.visit('/administration/email-templates')
      assertIsUnauthorized()
    })

    it('/topics redirects user to landing page', () => {
      cy.visit('/topics')
      assertIsUnauthorized()
    })

    it('renders /peerreview when visited', () => {
      cy.visit('/peerreview')
      cy.url().should('include', '/peerreview')
    })

    it('renders /register when visited', () => {
      cy.get('[data-cy=registrationlink]').click()
      cy.url().should('contain', '/register')
      cy.get('.registration-form').should('be.visible')
    })
  })

  describe('Page access for registered user', () => {
    beforeEach(() => {
      cy.loginAsRegisteredUser()
      cy.visit('/')
    })

    it.skip('/login redirects to /registrationdetails', () => {
      cy.visit('/login')
      assertIsOnRegistrationDetailsPage()
    })

    it('/register shows "already registered" message', () => {
      cy.visit('/register')
      assertIsAlreadyRegistered()
    })
  })

  describe('Page access for admin', () => {
    beforeEach(() => {
      cy.loginAsAdmin()
      cy.visit('/')
    })

    it('renders /administration/configuration when visited', () => {
      cy.get('.nav-menu-button').click()
      cy.get('.configuration-menu-item').click()
      cy.url().should('contain', '/administration/configuration')
      cy.contains('Change configuration')
    })

    it('renders /administration/customer-review-questions when visited', () => {
      cy.visit('/administration/customer-review-questions')
      cy.contains('Configure customer review questions')
      cy.contains('Create question set')
    })

    it('renders /administration/groups when visited', () => {
      cy.get('.nav-menu-button').click()
      cy.get('.group-management-menu-item').click()
      cy.url().should('contain', '/administration/groups')
      cy.contains('Group Management')
    })

    it('renders /administration/participants when visited', () => {
      cy.visit('/administration/participants')
      cy.url().should('contain', '/administration/participants')
      cy.get('.participants-container').should('be.visible')
    })

    it('renders /administration/peer-review-questions when visited', () => {
      cy.visit('/administration/peer-review-questions')
      cy.url().should('contain', '/administration/peer-review-questions')
      cy.get('.peer-review-questions-page').should('be.visible')
    })

    it('renders /administration/registration-questions when visited', () => {
      cy.visit('/administration/registration-questions')
      cy.url().should('contain', '/administration/registration-questions')
      cy.get('.registration-questions-page').should('be.visible')
    })

    it('renders /administration/registrationmanagement when visited', () => {
      cy.get('.nav-menu-button').click()
      cy.get('.registration-management-menu-item').click()
      cy.url().should('contain', '/administration/registrationmanagement')
      cy.contains('Registration and review management')
    })

    it('renders /administration/email-templates when visited', () => {
      cy.get('.nav-menu-button').click()
      cy.get('.email-templates-menu-item').click()
      cy.url().should('contain', '/administration/email-templates')
      cy.get('.email-templates-page').should('be.visible')
    })

    it('renders /topics when visited', () => {
      cy.get('.nav-menu-button').click()
      cy.get('.topics-menu-item').click()
      cy.url().should('contain', '/topics')
      cy.get('.topics-container').should('be.visible')
    })
  })

  describe('404 handler', () => {
    beforeEach(() => {
      cy.loginAsRegisteredUser()
    })
    it('shows a 404 not found page when entering an url that is not found', () => {
      cy.visit('/amksfmkafg-qfq435tefds')
      cy.get('.not-found-page').contains('Page not found')
    })

    it('redirects to / when clicking the return link', () => {
      cy.visit('/amksfmkafg-qfq435tefds')
      cy.get('.not-found-page').find('[data-cy="return-link"]').click()

      cy.url().should('include', '/registrationdetails')
    })
  })
})
