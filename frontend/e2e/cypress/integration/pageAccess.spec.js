const assertIsOnLandingPage = () => {
  cy.get('[data-cy=registrationlink]').should('be.visible')
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

describe.skip('Page access and redirect tests', () => {
  describe('Page access without authentication', () => {
    it('/administration/configuration redirects user to login page', () => {
      cy.visit('/administration/configuration')
      assertIsOnLoginPage()
    })

    it('/administration/customer-review-questions redirects user to login page', () => {
      cy.visit('/administration/customer-review-questions')
      assertIsOnLoginPage()
    })

    it('/administration/groups redirects user to login page', () => {
      cy.visit('/administration/groups')
      assertIsOnLoginPage()
    })

    it('/administration/participants redirects user to login page', () => {
      cy.visit('/administration/participants')
      assertIsOnLoginPage()
    })

    it('/administration/peer-review-questions redirects user to login page', () => {
      cy.visit('/administration/peer-review-questions')
      assertIsOnLoginPage()
    })

    it('/administration/registration-questions redirects user to login page', () => {
      cy.visit('/administration/registration-questions')
      assertIsOnLoginPage()
    })

    it('/administration/registrationmanagement redirects user to login page', () => {
      cy.visit('/administration/registrationmanagement')
      assertIsOnLoginPage()
    })

    it('/administration/email-templates redirects user to login page', () => {
      cy.visit('/administration/email-templates')
      assertIsOnLoginPage()
    })

    it('/peerreview redirects user to login page', () => {
      cy.visit('/peerreview')
      assertIsOnLoginPage()
    })

    it('/registrationdetails redirects user to login page', () => {
      cy.visit('/registrationdetails')
      assertIsOnLoginPage()
    })

    it('/register redirects user to login page', () => {
      cy.visit('/register')
      assertIsOnLoginPage()
    })

    it('/topics redirects user to login page', () => {
      cy.visit('/topics')
      assertIsOnLoginPage()
    })
  })

  describe.skip('Page access for user', () => {
    beforeEach(() => {
      cy.loginAsUnregisteredUser()
      cy.visit('/')
    })

    it('/administration/configuration redirects user to landing page', () => {
      cy.visit('/administration/configuration')
      assertIsOnLandingPage()
    })

    it('/administration/customer-review-questions redirects user to landing page', () => {
      cy.visit('/administration/customer-review-questions')
      assertIsOnLandingPage()
    })

    it('/administration/groups redirects user to landing page', () => {
      cy.visit('/administration/groups')
      assertIsOnLandingPage()
    })

    it('/administration/participants redirects user to landing page', () => {
      cy.visit('/administration/participants')
      assertIsOnLandingPage()
    })

    it('/administration/peer-review-questions redirects user to landing page', () => {
      cy.visit('/administration/peer-review-questions')
      assertIsOnLandingPage()
    })

    it('/administration/registration-questions redirects user to landing page', () => {
      cy.visit('/administration/registration-questions')
      assertIsOnLandingPage()
    })

    it('/administration/registrationmanagement redirects user to landing page', () => {
      cy.visit('/administration/registrationmanagement')
      assertIsOnLandingPage()
    })

    it('/administration/email-templates redirects user to login page', () => {
      cy.visit('/administration/email-templates')
      assertIsOnLandingPage()
    })

    it('/topics redirects user to landing page', () => {
      cy.visit('/topics')
      assertIsOnLandingPage()
    })

    it('renders /peerreview when visited', () => {
      cy.visit('/peerreview')
      cy.url().should('include', '/peerreview')
      cy.contains('You are not currently assigned to any group!')
    })

    it('renders /register when visited', () => {
      cy.get('[data-cy=registrationlink]').click()
      cy.url().should('contain', '/register')
      cy.get('.registration-form').should('be.visible')
    })
  })

  describe.skip('Page access for registered user', () => {
    beforeEach(() => {
      cy.loginAsRegisteredUser()
      cy.visit('/')
    })

    it('/login redirects to /registrationdetails', () => {
      cy.visit('/login')
      assertIsOnRegistrationDetailsPage()
    })

    it('/register shows "already registered" message', () => {
      cy.visit('/register')
      assertIsAlreadyRegistered()
    })
  })

  describe.skip('Page access for admin', () => {
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

  describe.skip('404 handler', () => {
    it('shows a 404 not found page when entering an url that is not found', () => {
      cy.visit('/amksfmkafg-qfq435tefds')
      cy.get('.not-found-page').contains('Page not found')
    })

    it('redirects to / when clicking the return link', () => {
      cy.visit('/amksfmkafg-qfq435tefds')
      cy.get('.not-found-page')
        .find('[data-cy="return-link"]')
        .click()

      assertIsOnLoginPage()
    })
  })
})
