/* globals cy Cypress */
// ***********************************************************
// This example support/index.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands'
import { TEST_USER, TEST_USER2, TEST_ADMIN } from '../common'

const postLogin = (user) => {
  const { headers } = user
  return cy.request({
    url: '/api/login',
    method: 'POST',
    headers
  })
}

const loginAsUser = (user) => {
  postLogin(user).then((res) => {
    const userData = res.body
    window.localStorage.setItem('loggedInUser', JSON.stringify(userData))
  })
}

Cypress.Commands.add('loginAsUnregisteredUser', () => {
  loginAsUser(TEST_USER)
})

Cypress.Commands.add('loginAsRegisteredUser', () => {
  loginAsUser(TEST_USER2)
})

Cypress.Commands.add('loginAsAdmin', () => {
  loginAsUser(TEST_ADMIN)
})

const withLoggedAdminToken = (fn) => {
  postLogin(TEST_ADMIN).then((res) => {
    const { token } = res.body
    fn(token)
  })
}

const withLoggedAdminTokenSuperHack = () => {
  return postLogin(TEST_ADMIN).then((res) => res.body.token)
}

Cypress.Commands.add('deleteRegistrationQuestions', () => {
  withLoggedAdminToken((token) => {
    const authHeaders = {
      Authorization: 'Bearer ' + token
    }

    cy.request({
      url: '/api/registrationQuestions',
      method: 'GET',
      headers: authHeaders
    }).then((res) => {
      const { questionSets } = res.body

      for (const set of questionSets) {
        cy.request({
          url: `/api/registrationQuestions/${set.id}`,
          method: 'DELETE',
          headers: authHeaders
        })
      }
    })
  })
})

Cypress.Commands.add('createRegistrationQuestionSet', (name, questions) => {
  withLoggedAdminToken((token) => {
    const authHeaders = {
      Authorization: 'Bearer ' + token
    }

    cy.request({
      url: '/api/registrationQuestions',
      method: 'POST',
      headers: authHeaders,
      body: {
        name,
        questions
      }
    })
  })
})

Cypress.Commands.add('deleteReviewQuestions', () => {
  withLoggedAdminToken((token) => {
    const authHeaders = {
      Authorization: 'Bearer ' + token
    }

    cy.request({
      url: '/api/reviewQuestions',
      method: 'GET',
      headers: authHeaders
    }).then((res) => {
      const { questionSets } = res.body

      for (const set of questionSets) {
        cy.request({
          url: `/api/reviewQuestions/${set.id}`,
          method: 'DELETE',
          headers: authHeaders
        })
      }
    })
  })
})

Cypress.Commands.add('createReviewQuestionSet', (name, questions) => {
  withLoggedAdminToken((token) => {
    const authHeaders = {
      Authorization: 'Bearer ' + token
    }

    cy.request({
      url: '/api/reviewQuestions',
      method: 'POST',
      headers: authHeaders,
      body: {
        name,
        questions
      }
    })
  })
})

Cypress.Commands.add('createGroup', (groupData) => {
  withLoggedAdminToken((token) => {
    const authHeaders = {
      Authorization: 'Bearer ' + token
    }
    const {
      name,
      topicId,
      configurationId,
      instructorId,
      studentIds
    } = groupData

    cy.request({
      url: '/api/groups',
      method: 'POST',
      headers: authHeaders,
      body: {
        name,
        topicId,
        configurationId,
        instructorId,
        studentIds
      }
    })
  })
})

Cypress.Commands.add('deleteAllGroups', () => {
  withLoggedAdminToken((token) => {
    const authHeaders = {
      Authorization: 'Bearer ' + token
    }
    cy.request({
      url: '/api/groups',
      method: 'GET',
      headers: authHeaders
    }).then((res) => {
      const allGroups = res.body
      for (const group of allGroups) {
        cy.request({
          url: `/api/groups/${group.id}`,
          method: 'DELETE',
          headers: authHeaders
        })
      }
    })
  })
})

Cypress.Commands.add(
  'createNewTopic',
  (newTopicName, customerName, topicDescription) => {
    withLoggedAdminToken((token) => {
      const authHeaders = {
        Authorization: 'Bearer ' + token
      }
      cy.request({
        url: '/api/topics',
        method: 'POST',
        headers: authHeaders,
        active: true,
        body: {
          content: {
            email: 'asiakas@asiakas.com',
            title: newTopicName,
            description: topicDescription,
            environment: 'Web',
            customerName: customerName,
            additionalInfo: '',
            specialRequests: ''
          }
        }
      })
    })
  }
)

Cypress.Commands.add('setTopicActive', (topicId) => {
  withLoggedAdminToken((token) => {
    const authHeaders = {
      Authorization: 'Bearer ' + token
    }
    cy.request({
      url: `api/topics/${topicId}`,
      method: 'PUT',
      headers: authHeaders,
      body: {
        topic: {
          active: true
        }
      }
    })
  })
})

Cypress.Commands.add(
  'setPeerReviewOneActive',
  (configurationName, configurationId, questionSetName) => {
    withLoggedAdminToken((token) => {
      const authHeaders = {
        Authorization: 'Bearer ' + token
      }
      findReviewQuestionId(authHeaders, questionSetName).then((setId) => {
        cy.request({
          url: `api/configurations/${configurationId}`,
          method: 'PUT',
          headers: authHeaders,
          body: {
            name: configurationName,
            review_question_set_1_id: setId
          }
        })
        cy.request({
          url: '/api/registrationManagement',
          method: 'POST',
          headers: authHeaders,
          body: {
            registrationManagement: {
              peer_review_conf: 1,
              peer_review_open: true,
              peer_review_round: 1,
              project_registration_conf: 1,
              project_registration_open: true,
              project_registration_message: '',
              project_registration_info:
                'Project registration will be open until DD.MM.2019.',
              topic_registration_conf: 1,
              topic_registration_open: true,
              topic_registration_message: ''
            }
          }
        })
      })
    })
  }
)

Cypress.Commands.add('deleteAllPeerReviews', () => {
  withLoggedAdminToken((token) => {
    const authHeaders = {
      Authorization: 'Bearer ' + token
    }
    cy.request({
      url: '/api/peerreview/all',
      method: 'GET',
      headers: authHeaders
    }).then((res) => {
      const allReviews = res.body
      for (const review of allReviews) {
        cy.request({
          url: `/api/peerreview/${review.id}`,
          method: 'DELETE',
          headers: authHeaders
        })
      }
    })
  })
})

const findReviewQuestionId = (authHeaders, questionSetName) => {
  return cy
    .request({
      url: '/api/reviewQuestions',
      method: 'GET',
      headers: authHeaders
    })
    .then((res) => {
      const { questionSets } = res.body

      for (const set of questionSets) {
        if (set.name === questionSetName) {
          return set.id
        }
      }
    })
}

Cypress.Commands.add('deleteAllEmailTemplates', () => {
  withLoggedAdminToken((token) => {
    const authHeaders = {
      Authorization: 'Bearer ' + token
    }
    cy.request({
      url: '/api/email/templates',
      method: 'DELETE',
      headers: authHeaders
    })
  })
})

const defaultEmailTemplates = () => ({
  topicAccepted: { finnish: '', english: '' },
  topicRejected: { finnish: '', english: '' }
})

Cypress.Commands.add(
  'updateEmailTemplate',
  (templateName, templateLanguage, text) => {
    withLoggedAdminToken((token) => {
      const authHeaders = {
        Authorization: 'Bearer ' + token
      }

      const body = defaultEmailTemplates()
      body[templateName][templateLanguage] = text

      cy.request({
        url: '/api/email/templates',
        method: 'POST',
        headers: authHeaders,
        body
      })
    })
  }
)

Cypress.Commands.add('updateAllEmailTemplates', (body) => {
  withLoggedAdminToken((token) => {
    const authHeaders = {
      Authorization: 'Bearer ' + token
    }

    cy.request({
      url: '/api/email/templates',
      method: 'POST',
      headers: authHeaders,
      body
    })
  })
})

Cypress.Commands.add('deleteSentEmails', () => {
  withLoggedAdminToken((token) => {
    const authHeaders = {
      Authorization: 'Bearer ' + token
    }

    cy.request({
      url: '/api/email/sent-emails',
      method: 'DELETE',
      headers: authHeaders
    })
  })
})

Cypress.Commands.add('deleteCustomerReviewQuestions', () => {
  withLoggedAdminToken((token) => {
    const authHeaders = {
      Authorization: 'Bearer ' + token
    }

    cy.request({
      url: '/api/customerReviewQuestions',
      method: 'GET',
      headers: authHeaders
    }).then((res) => {
      const { questionSets } = res.body

      for (const set of questionSets) {
        cy.request({
          url: `/api/customerReviewQuestions/${set.id}`,
          method: 'DELETE',
          headers: authHeaders
        })
      }
    })
  })
})

Cypress.Commands.add('createCustomerReviewQuestionSet', (name, questions) => {
  withLoggedAdminToken((token) => {
    const authHeaders = {
      Authorization: 'Bearer ' + token
    }

    cy.request({
      url: '/api/customerReviewQuestions',
      method: 'POST',
      headers: authHeaders,
      body: {
        name,
        questions
      }
    })
  })
})

Cypress.Commands.add(
  'setCustomerReviewQuestionSetToConfiguration',
  (configurationId) => {
    withLoggedAdminToken((token) => {
      const authHeaders = {
        Authorization: 'Bearer ' + token
      }

      cy.request({
        url: '/api/customerReviewQuestions',
        method: 'GET',
        headers: authHeaders
      }).then((res) => {
        const questionSet = res.body.questionSets[0]
        cy.request({
          url: `/api/configurations/${configurationId}`,
          method: 'PUT',
          headers: authHeaders,
          body: {
            content: null,
            customer_review_question_set_id: questionSet.id,
            name: 'Konfiguraatio 1',
            registration_question_set_id: null,
            review_question_set_1_id: null,
            review_question_set_2_id: null
          }
        })
      })
    })
  }
)

Cypress.Commands.add('deleteCustomerReviews', () => {
  withLoggedAdminToken((token) => {
    const authHeaders = {
      Authorization: 'Bearer ' + token
    }

    cy.request({
      url: '/api/customerReview/',
      method: 'GET',
      headers: authHeaders
    }).then((res) => {
      const { reviews } = res.body
      if (reviews) {
      }
      for (const review of reviews) {
        cy.request({
          url: `/api/customerReview/${review.id}`,
          method: 'DELETE',
          headers: authHeaders
        })
      }
    })
  })
})

Cypress.Commands.add('deleteInstructorReviews', () => {
  withLoggedAdminToken((token) => {
    const authHeaders = {
      Authorization: 'Bearer ' + token
    }

    cy.request({
      url: '/api/instructorReview/',
      method: 'GET',
      headers: authHeaders
    }).then((res) => {
      const { reviews } = res.body
      if (reviews) {
      }
      for (const review of reviews) {
        cy.request({
          url: `/api/instructorReview/${review.id}`,
          method: 'DELETE',
          headers: authHeaders
        })
      }
    })
  })
})

Cypress.Commands.add('createPeerReviews', (peerReviews) => {
  withLoggedAdminToken((token) => {
    const authHeaders = {
      Authorization: 'Bearer ' + token
    }

    cy.request({
      url: '/api/peerreview/insertTestData',
      method: 'POST',
      headers: authHeaders,
      body: peerReviews
    })
  })
})

Cypress.Commands.add('createConfiguration', (configurationData) => {
  return withLoggedAdminTokenSuperHack().then((token) => {
    const authHeaders = {
      Authorization: 'Bearer ' + token
    }
    const {
      name,
      content,
      registration_question_set_id,
      review_question_set_1_id,
      review_question_set_2_id,
      customer_review_question_set_id
    } = configurationData

    return cy
      .request({
        url: '/api/configurations',
        method: 'POST',
        headers: authHeaders,
        body: {
          name,
          content,
          registration_question_set_id,
          review_question_set_1_id,
          review_question_set_2_id,
          customer_review_question_set_id
        }
      })
      .then((res) => res.body.configuration)
  })
})

Cypress.Commands.add('createTopic', (topicContent, topicConfigurationId) => {
  return withLoggedAdminTokenSuperHack().then((token) => {
    const authHeaders = {
      Authorization: 'Bearer ' + token
    }
    return cy
      .request({
        url: '/api/topics',
        method: 'POST',
        headers: authHeaders,
        body: {
          content: topicContent,
          configuration_id: topicConfigurationId
        }
      })
      .then((res) => res.body.topic)
  })
})

Cypress.Commands.add('deleteConfiguration', (configurationId) => {
  withLoggedAdminTokenSuperHack().then((token) => {
    const authHeaders = {
      Authorization: 'Bearer ' + token
    }
    cy.request({
      url: `/api/configurations/${configurationId}`,
      method: 'DELETE',
      headers: authHeaders
    })
  })
})

Cypress.Commands.add('deleteCustomerReview', (customerReviewId) => {
  withLoggedAdminTokenSuperHack().then((token) => {
    const authHeaders = {
      Authorization: 'Bearer ' + token
    }
    cy.request({
      url: `/api/customerreviews/delete/${customerReviewId}`,
      method: 'DELETE',
      headers: authHeaders
    })
  })
})

Cypress.Commands.add('createCustomerReview', (customerReview) => {
  withLoggedAdminTokenSuperHack().then((token) => {
    const authHeaders = {
      Authorization: 'Bearer ' + token
    }
    //const { answerSheet, group_id, topic_id, configuration_id } = customerReview
    cy.request({
      url: '/api/customerReview',
      method: 'POST',
      headers: authHeaders,
      body: {
        customerReview
      }
    })
  })
})

Cypress.Commands.add('createGroupHack', (groupData) => {
  return withLoggedAdminTokenSuperHack().then((token) => {
    const authHeaders = {
      Authorization: 'Bearer ' + token
    }
    const {
      name,
      topicId,
      configurationId,
      instructorId,
      studentIds
    } = groupData

    return cy
      .request({
        url: '/api/groups',
        method: 'POST',
        headers: authHeaders,
        body: {
          name,
          topicId,
          configurationId,
          instructorId,
          studentIds
        }
      })
      .then((res) => res.body)
  })
})

Cypress.Commands.add('deleteCustomerReview', (customerReviewId) => {
  withLoggedAdminToken().then((token) => {
    const authHeaders = {
      Authorization: 'Bearer ' + token
    }
    cy.request({
      url: `/api/customerreviews/delete/${customerReviewId}`,
      method: 'DELETE',
      headers: authHeaders
    })
  })
})

Cypress.Commands.add('createCustomerReview', (customerReview) => {
  withLoggedAdminTokenSuperHack().then((token) => {
    const authHeaders = {
      Authorization: 'Bearer ' + token
    }
    //const { answerSheet, group_id, topic_id, configuration_id } = customerReview
    cy.request({
      url: '/api/customerReview',
      method: 'POST',
      headers: authHeaders,
      body: {
        customerReview
      }
    })
  })
})

Cypress.Commands.add('createGroupHack', (groupData) => {
  return withLoggedAdminTokenSuperHack().then((token) => {
    const authHeaders = {
      Authorization: 'Bearer ' + token
    }
    const {
      name,
      topicId,
      configurationId,
      instructorId,
      studentIds
    } = groupData

    return cy
      .request({
        url: '/api/groups',
        method: 'POST',
        headers: authHeaders,
        body: {
          name,
          topicId,
          configurationId,
          instructorId,
          studentIds
        }
      })
      .then((res) => res.body)
  })
})
