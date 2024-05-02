/* eslint-disable */

describe('Tag management', () => {

  beforeEach(() => {
    cy.loginAsAdmin()
    cy.visit('/')
  })

  it('tag management page opens', () => {
    cy.get('#hamburger-menu-button')
      .click()
      .then(() => {
        cy.contains('Tag management').click()
      })
    cy.contains('Add new tag').should('exist')

  })
  it('admin can add a new tag', () => {
    cy.get('#hamburger-menu-button')
      .click()
      .then(() => {
        cy.contains('Tag management').click()
      })
    cy.get('#tagTitle').type('New tag')
    cy.get('.button').click()
    cy.contains('New tag').should('exist')
  })
  it('duplicate tag cannot be added', () => {
    cy.get('#hamburger-menu-button')
      .click()
      .then(() => {
        cy.contains('Tag management').click()
      })
    cy.get('#tagTitle').type('New tag')
    cy.get('.button').click()
    cy.get('#tagTitle').clear().type('New tag')
    cy.get('.button').click()
    cy.contains('Tag already exists').should('exist')
  })
  it('too short tag cannot be added', () => {
    cy.get('#hamburger-menu-button')
      .click()
      .then(() => {
        cy.contains('Tag management').click()
      })
    cy.get('#tagTitle').type('NT')
    cy.get('.button').click()
    cy.contains('Title must be at least 3 characters.').should('exist')
  })
  it('tag is not deleted when No is pressed in confirmation dialog', () => {
    cy.get('#hamburger-menu-button')
      .click()
      .then(() => {
        cy.contains('Tag management').click()
      })
    cy.get('#tagTitle').type('New tag')
    cy.get('.delete-tag-button').click()
    cy.contains('No').click()
    cy.contains('New tag').should('exist')
  })
  it('tag is deleted when Yes is pressed in confirmation dialog', () => {
    cy.get('#hamburger-menu-button')
      .click()
      .then(() => {
        cy.contains('Tag management').click()
      })
    cy.get('#tagTitle').type('New tag')
    cy.get('.delete-tag-button').click()
    cy.contains('Yes').click()
    cy.contains('New tag').should('not.exist')
  })
  // missing test: tag associated with existing time log cannot be deleted  
  // is not tested. This is because the test would require a time log to be created and associated with a tag.'
  // and cannot be done before adding tag to time logs front end is implemented.
  // all backend functionality is there
})
