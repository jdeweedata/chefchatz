describe('Home Page', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('should display the welcome message', () => {
    cy.get('h1').contains('Welcome to ChefChatz')
    cy.get('p').contains('Your AI-powered cooking companion')
  })

  it('should have proper meta tags', () => {
    cy.get('head title').should('contain', 'ChefChatz')
    cy.get('head meta[name="description"]').should(
      'have.attr',
      'content',
      'Your AI-powered cooking companion'
    )
  })
})
