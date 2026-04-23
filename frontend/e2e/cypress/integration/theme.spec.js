/* eslint-disable */

describe('Theme switch', () => {
  it('uses light mode by default when no localStorage value exists', () => {
    cy.visit('/', {
      onbeforeload(win) {
        win.localstorage.clear()
      },
    })

    cy.window().its('localStorage.theme').should('eq', undefined)

    cy.get('body').should(($body) => {
      const bg = getComputedStyle($body[0]).backgroundColor
      expect(bg).to.equal('rgb(250, 250, 250)')
    })
  })

  it('starts in dark mode when localStorage.theme = dark', () => {
    cy.visit('/', {
      onBeforeLoad(win) {
        win.localStorage.setItem('theme', 'dark')
      },
    })

    cy.window().its('localStorage.theme').should('eq', 'dark')
    cy.get('body').should(($body) => {
      const bg = getComputedStyle($body[0]).backgroundColor
      expect(bg).to.equal('rgb(48, 48, 48)')
    })
  })

  it('saves theme to localStorage', () => {
    cy.visit('/', {
      onbeforeload(win) {
        win.localstorage.clear()
      },
    })

    cy.window().its('localStorage.theme').should('eq', undefined)

    cy.get('[data-cy="theme-toggle"]').click()
    cy.window().its('localStorage.theme').should('eq', 'dark')

    cy.get('[data-cy="theme-toggle"]').click()
    cy.window().its('localStorage.theme').should('eq', 'light')
  })
})
