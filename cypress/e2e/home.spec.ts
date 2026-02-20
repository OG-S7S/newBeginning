describe('Home page', () => {
  it('loads and shows basic layout', () => {
    cy.visit('/')
    cy.get('body').should('be.visible')
    cy.get('nav').should('exist')
  })
})
