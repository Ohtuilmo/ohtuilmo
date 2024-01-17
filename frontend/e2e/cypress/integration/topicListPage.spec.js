/* globals cy describe beforeEach it expect */
const visitTopicsPage = (visitArgs) => cy.visit('/topics', visitArgs)

const findTopicActiveCheckbox = (topicName) =>
  cy
    .get(`[data-cy-topic-name="${topicName}"]`)
    .find('[data-cy="toggle-active"]')

const getSendAcceptButton = (topicName) =>
  cy
    .get(`[data-cy-topic-name="${topicName}"]`)
    .find('[data-cy="send-accept-mail"]')

const getSendRejectButton = (topicName) =>
  cy
    .get(`[data-cy-topic-name="${topicName}"]`)
    .find('[data-cy="send-reject-mail"]')

const getSendReviewLinkButton = (topicName) =>
  cy
    .get(`[data-cy-topic-name="${topicName}"]`)
    .find('[data-cy="send-customer-review-link-email"]')

const clickSendAcceptEmail = (topicName) =>
  getSendAcceptButton(topicName).click()

const clickSendRejectEmail = (topicName) =>
  getSendRejectButton(topicName).click()

const clickSendReviewLinkEmail = (topicName) =>
  getSendReviewLinkButton(topicName).click()

/** @param {'finnish' | 'english'} language */
const clickEmailLanguage = (language) =>
  cy
    .get('[data-cy="email-language-menu"]')
    .find(`[data-cy-send-mail-lang="${language}"]`)
    .click()

describe('Topic list page', () => {
  beforeEach(() => {
    cy.loginAsAdmin()
  })

  describe('topics', () => {
    const toggleTestTopicName = 'Aihe C'

    beforeEach(() => {
      visitTopicsPage()
    })

    it('renders the topic names correctly', () => {
      const topicTitles = ['Aihe A', 'Aihe B']

      for (const topicTitle of topicTitles) {
        cy.get(`[data-cy-topic-name="${topicTitle}"]`)
          .find('.topic-table-row__topic-title')
          .should('have.text', topicTitle)
      }
    })

    it('renders the customer names and emails correctly', () => {
      cy.get('[data-cy-topic-name="Aihe A"]')
        .find('.topic-table-row__customer')
        .contains('Aasiakas')
      cy.get('[data-cy-topic-name="Aihe A"]')
        .find('.topic-table-row__customer')
        .contains('aasia@kas')
    })

    it('toggles topic active state correctly', () => {
      // get initial checked state
      findTopicActiveCheckbox(toggleTestTopicName).then(($input) => {
        const desiredState = $input.prop('checked')
          ? 'not.be.checked'
          : 'be.checked'

        // toggle active
        findTopicActiveCheckbox(toggleTestTopicName).click()

        // did it change state?
        findTopicActiveCheckbox(toggleTestTopicName).should(desiredState)

        visitTopicsPage()

        // still in correct state after refresh?
        findTopicActiveCheckbox(toggleTestTopicName).should(desiredState)
      })
    })
  })

  describe('emails', () => {
    // from seed "page-access-seeds"
    const topicName = 'Aihe A'
    const topicSecretId = 'eec0neeT0jo0ae9F'
    const emailAddress = 'aasia@kas'
    const secretReviewLink = `https://study.cs.helsinki.fi/projekti/customer-review/${topicSecretId}`

    beforeEach(() => {
      cy.deleteSentEmails()
      cy.updateAllEmailTemplates({
        topicAccepted: {
          finnish: 'Projekti {{topicName}} hyväksytty.',
          english: 'Project {{topicName}} was accepted.'
        },
        topicRejected: {
          finnish: 'Projekti {{topicName}} hylätty.',
          english: 'Project {{topicName}} was rejected.'
        },
        customerReviewLink: {
          finnish:
            'Arviointi on nyt auki projektille {{topicName}} osoitteessa {{secretLink}}',
          english:
            'Review is now open for project {{topicName}}, go to {{secretLink}}'
        }
      })
      visitTopicsPage({
        // spy window.confirm for email preview tests
        onBeforeLoad(win) {
          cy.spy(win, 'confirm')
        }
      })
    })

    it('shows email languages after clicking accept', () => {
      clickSendAcceptEmail(topicName)

      cy.get('[data-cy="email-language-menu"]')
        .should('be.visible')
        .and('have.descendants', '[data-cy-send-mail-lang="finnish"]')
        .and('have.descendants', '[data-cy-send-mail-lang="english"]')
    })

    it('shows email languages after clicking reject', () => {
      clickSendRejectEmail(topicName)

      cy.get('[data-cy="email-language-menu"]')
        .should('be.visible')
        .and('have.descendants', '[data-cy-send-mail-lang="finnish"]')
        .and('have.descendants', '[data-cy-send-mail-lang="english"]')
    })

    it('shows email languages after clicking send customer review link', () => {
      clickSendReviewLinkEmail(topicName)

      cy.get('[data-cy="email-language-menu"]')
        .should('be.visible')
        .and('have.descendants', '[data-cy-send-mail-lang="finnish"]')
        .and('have.descendants', '[data-cy-send-mail-lang="english"]')
    })

    it('shows a success popup after sending an email', () => {
      clickSendAcceptEmail(topicName)
      clickEmailLanguage('finnish')

      cy.get('.notification').contains('Email sent!')
    })

    it('shows a success popup after re-sending an email', () => {
      clickSendAcceptEmail(topicName)
      clickEmailLanguage('finnish')
      cy.get('.notification').contains('Email sent!')

      clickSendAcceptEmail(topicName)
      clickEmailLanguage('finnish')
      cy.get('.notification').contains('Email sent!')
    })

    describe('accept/reject buttons', () => {
      it('changes accept button text to "resend accept" after sending', () => {
        getSendAcceptButton(topicName).should('have.text', 'Accept')

        clickSendAcceptEmail(topicName)
        clickEmailLanguage('finnish')

        getSendAcceptButton(topicName).should('have.text', 'Resend Accept')
      })

      it('changes reject button text to "resend reject" after sending', () => {
        getSendRejectButton(topicName).should('have.text', 'Reject')

        clickSendRejectEmail(topicName)
        clickEmailLanguage('finnish')

        getSendRejectButton(topicName).should('have.text', 'Resend Reject')
      })

      it('does not change the buttons of another topic after sending accept and reject', () => {
        getSendAcceptButton('Aihe B').should('have.text', 'Accept')
        getSendRejectButton('Aihe B').should('have.text', 'Reject')

        clickSendAcceptEmail('Aihe A')
        clickEmailLanguage('english')
        clickSendRejectEmail('Aihe A')
        clickEmailLanguage('english')

        getSendAcceptButton('Aihe B').should('have.text', 'Accept')
        getSendRejectButton('Aihe B').should('have.text', 'Reject')
      })
    })

    describe('customer review button', () => {
      it('changes send link text to send reminder after sending', () => {
        getSendReviewLinkButton(topicName).should('have.text', 'Send link')

        clickSendReviewLinkEmail(topicName)
        clickEmailLanguage('finnish')

        getSendReviewLinkButton(topicName).should('have.text', 'Send reminder')
      })

      it('does not change the buttons of another topic after sending link', () => {
        getSendReviewLinkButton('Aihe B').should('have.text', 'Send link')

        clickSendReviewLinkEmail('Aihe A')
        clickEmailLanguage('english')

        getSendReviewLinkButton('Aihe B').should('have.text', 'Send link')
      })
    })

    describe('email preview', () => {
      it('shows the correctly rendered email confirm for topic accepted (finnish) template', () => {
        clickSendAcceptEmail(topicName)
        clickEmailLanguage('finnish')
        cy.window()
          .its('confirm')
          .should((confirmSpy) => {
            expect(confirmSpy).to.be.calledOnce
            expect(confirmSpy.getCall(0).args[0]).to.contain(
              `Projekti ${topicName} hyväksytty.`
            )
          })
      })

      it('shows the correctly rendered email confirm for topic accepted (english) template', () => {
        clickSendAcceptEmail(topicName)
        clickEmailLanguage('english')
        cy.window()
          .its('confirm')
          .should((confirmSpy) => {
            expect(confirmSpy).to.be.calledOnce
            expect(confirmSpy.getCall(0).args[0]).to.contain(
              `Project ${topicName} was accepted.`
            )
          })
      })

      it('shows the correctly rendered email confirm for topic rejected (finnish) template', () => {
        clickSendRejectEmail(topicName)
        clickEmailLanguage('finnish')
        cy.window()
          .its('confirm')
          .should((confirmSpy) => {
            expect(confirmSpy).to.be.calledOnce
            expect(confirmSpy.getCall(0).args[0]).to.contain(
              `Projekti ${topicName} hylätty.`
            )
          })
      })

      it('shows the correctly rendered email confirm for topic rejected (english) template', () => {
        clickSendRejectEmail(topicName)
        clickEmailLanguage('english')
        cy.window()
          .its('confirm')
          .should((confirmSpy) => {
            expect(confirmSpy).to.be.calledOnce
            expect(confirmSpy.getCall(0).args[0]).to.contain(
              `Project ${topicName} was rejected.`
            )
          })
      })

      it('shows the correctly rendered email confirm for customer review link (finnish)', () => {
        clickSendReviewLinkEmail(topicName)
        clickEmailLanguage('finnish')
        cy.window()
          .its('confirm')
          .should((confirmSpy) => {
            expect(confirmSpy).to.be.calledOnce
            expect(confirmSpy.getCall(0).args[0]).to.contain(
              `Arviointi on nyt auki projektille ${topicName} osoitteessa ${secretReviewLink}`
            )
          })
      })

      it('shows the correctly rendered email confirm for customer review link (english)', () => {
        clickSendReviewLinkEmail(topicName)
        clickEmailLanguage('english')
        cy.window()
          .its('confirm')
          .should((confirmSpy) => {
            expect(confirmSpy).to.be.calledOnce
            expect(confirmSpy.getCall(0).args[0]).to.contain(
              `Review is now open for project ${topicName}, go to ${secretReviewLink}`
            )
          })
      })
    })
  })
})
