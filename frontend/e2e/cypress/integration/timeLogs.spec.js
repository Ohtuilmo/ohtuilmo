describe('Time Logs Page', () => {
    beforeEach(() => {
      cy.clearLocalStorage()
      cy.loginAsRegisteredUser()
      cy.createGroup({
        name: 'Brand New Group',
        topicId: 1,
        configurationId: 1,
        instructorId: null,
        studentIds: ['012345698']
      })
      cy.visit('/sprints')
      cy.get('.sprints-container').should('exist')
      cy.get('#sprintNumber').type('1')
      cy.get('#startDate').type('2022-01-01')
      cy.get('#endDate').type('2022-01-31')
      cy.get('.button').click()
      cy.wait(200)
      
      cy.visit('/timelogs')
    })

    //currently just placeholder, no such functionality immpemented
    it.skip('does not show log form when there are no sprints', () => {
      cy.wait(2500)
      cy.get('.timelogs-container-1').should('not.exist')
    })

    it('creates timeLog successfully', () => {
      cy.visit('/timelogs')
      cy.get('.timelogs-container-1').should('exist')
      cy.get('.input-container').should('exist')
      cy.get('.date').type('2022-01-01')
      cy.get('.time').type('01:00')
      cy.get('.description').type('Test description')
      cy.get('.submit-button').click()

      cy.get('.notification').should('exist')
      cy.get('.notification').should('have.text', 'Time log created successfully')
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
      cy.get('.notification').should('have.text', 'Description must be over 5 characters.')
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
      cy.get('.notification').should('have.text', 'The log date is not within sprint start and end date.')
    })

    after(() => {
      cy.visit('/sprints')
      cy.get('.delete-sprint-button').click()
      cy.deleteAllGroups()
    })
})
