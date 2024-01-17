describe('Group Management Page', () => {
  beforeEach(() => {
    cy.clearLocalStorage()
    cy.loginAsAdmin()
    cy.visit('/administration/groups')
  })

  describe('Creating a group', () => {
    it('is successful when all necessary details are provided', () => {
      cy.get('.configuration-selector').click()
      cy.get('.configuration-1').click()
      cy.get('.create-group-form-topic__selector').click()
      cy.get('.topic-menu-item')
        .contains('Aihe A')
        .click()
      cy.get('.create-group-form__name')
        .clear()
        .type('Ryhmä A')
      cy.get('.create-group-form__student-input').type('012345678, 012345688')

      cy.get('.create-group-form__instructor').click()

      cy.get('.create-group-form__instructor')
        .find('input')
        .type('Angela', { force: true })

      cy.get('.create-group-form__instructor').find(
        '.create-group-form__instructor__option'
      )

      cy.get('.create-group-form__instructor')
        .find('input')
        .type('{enter}', { force: true })

      cy.get('.create-group-submit').click()
      cy.get('.notification').should('have.text', 'Group saved!')
    })
  })

  describe('Viewing a group', () => {
    beforeEach(() => {
      cy.get('.configuration-selector').click()
      cy.get('.configuration-1').click()
    })

    it('deletes a student', () => {
      cy.get('[data-cy=delete-student-button]')
        .eq(1)
        .click()
      cy.get('.group-students')
        .eq(0)
        .should('not.contain', '012345688')
      cy.get('.notification').should('have.text', 'Student deleted!')
    })

    it('deletes an instructor', () => {
      cy.get('[data-cy=delete-instructor-button]')
        .eq(0)
        .click()
      cy.get('.group-instructor')
        .eq(0)
        .should('not.contain', '012345698')
      cy.get('.group-instructor')
        .eq(0)
        .should('contain', 'No instructor assigned')
      cy.get('.notification').should('have.text', 'Instructor deleted!')
    })
  })

  describe('Editing a group', () => {
    beforeEach(() => {
      cy.get('.configuration-selector').click()
      cy.get('.configuration-1').click()
      cy.get('[data-cy=edit-group-button]')
        .eq(0)
        .click()
      cy.get('.notification')
        .should('contain', 'Editing for group')
        .should('contain', 'enabled!')
    })

    it('changes group name', () => {
      cy.get('[data-cy=edit-group-name-field]')
        .clear()
        .type('Ryhmä B')
      cy.get('[data-cy=edit-group-save-button]').click()
      cy.get('.notification').should('have.text', 'Group updated!')
      cy.get('.group-name')
        .eq(0)
        .should('contain', 'Ryhmä B')
    })

    /*
    it('changes topic', () => {
      cy.get('.edit-group-form-topic__selector')
        .should('be.visible')
        .click()
      cy.get('.topic-menu-item')
        .should('be.visible')
        .within(() => {
          cy.wait(500)
          cy.contains('Aihe B').click()
        })
      cy.get('[data-cy=edit-group-name-field]')
        .clear()
        .type('Ryhmä B')
      cy.get('[data-cy=edit-group-save-button]').click()
      cy.get('.notification').should('have.text', 'Group updated!')
      cy.get('.group-topic')
        .eq(0)
        .should('contain', 'Aihe B')
    })
    */

    it('changes instructor', () => {
      cy.get('.edit-group-instructor').click()

      cy.get('.edit-group-instructor')
        .find('input')
        .type('{backspace}', { force: true })

      cy.get('.edit-group-instructor')
        .find('input')
        .type('Testaaja', { force: true })

      cy.get('.edit-group-instructor__option')

      cy.get('.edit-group-instructor')
        .find('input')
        .type('{enter}', { force: true })

      cy.get('[data-cy=edit-group-save-button]').click()
      cy.get('.notification').should('have.text', 'Group updated!')
      cy.get('.group-instructor')
        .eq(0)
        .should('contain', '012345678')
    })

    it('adds new student', () => {
      cy.get('[data-cy=edit-students-input]').type(', 012345698')
      cy.get('[data-cy=edit-group-save-button]').click()
      cy.get('.notification').should('have.text', 'Group updated!')
      cy.get('.group-students').should('contain', '012345698')
    })

    it('deletes a group', () => {
      cy.get('[data-cy=edit-group-delete-button]').click()
      cy.get('.notification').should('have.text', 'Group deleted!')
    })
  })
})
