describe('Time Logs Page', () => {
    before(() => {
      cy.clearLocalStorage()
      cy.loginAsRegisteredUser()
      cy.createGroup({
        name: 'Brand New Group',
        topicId: 1,
        configurationId: 1,
        instructorId: null,
        studentIds: ['012345698']
      })
      cy.visit('/timelogs')
    })

    it('does not show log form when there are no sprints', () => {
      cy.wait(2500)
      cy.get('.timelogs-container-1').should('not.exist')
    })

    after(() => {
        cy.deleteAllGroups()
    })
})