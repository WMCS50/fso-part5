describe('Blog app', function () {
  beforeEach(function() {
    cy.request('POST', `${Cypress.env('BACKEND')}/testing/reset`)

    const user = {
      name: 'tester1',
      username: 'tester1',
      password: 'pass1'
    }
    cy.request('POST', `${Cypress.env('BACKEND')}/users`, user)
    cy.visit('')

  })

  it('login form is shown', function(){
    cy.contains('Log in to application')
    cy.contains('log in')
  })

  describe('Login', function(){
    it('login form can be opened', function(){
      cy.contains('log in').click()
      cy.contains('username')
      cy.contains('password')
    })

    it('login form succeeds with correct credentials', function(){
      cy.contains('log in').click()
      cy.get('#username').type('tester1')
      cy.get('#password').type('pass1')
      cy.get('#login-button').click()
      cy.contains('tester1 is logged in')
    })

    it('login form fails with incorrect credentials', function(){
      cy.contains('log in').click()
      cy.get('#username').type('tester2')
      cy.get('#password').type('pass1')
      cy.get('#login-button').click()
      cy.get('.error').should('contain', 'Wrong credentials -- try again')
      cy.get('html').should('not.contain', 'tester2 is logged in')
    })
  })

  describe('When logged in', function() {
    beforeEach(function() {
      cy.login({ username: 'tester1', password: 'pass1' })
    })
    it('A blog can be created', function() {
      cy.contains('create new blog').click()
      cy.get('#title-input').type('blog 1 title')
      cy.get('#author-input').type('blog 1 author')
      cy.get('#url-input').type('blog 1 url')
      cy.get('#create-button').click()
      cy.contains('a new blog blog 1 title by blog 1 author added')
    })

    it('A blog can be liked', function() {
      cy.createBlog({
        title: 'BlogX',
        author: 'BlogX Author',
        url: 'BlogX.com'
      })
      cy.contains('BlogX')
      cy.get('#hide-view').click()
      cy.contains('likes 0')
      cy.get('#like').click()
      cy.contains('likes 1')
    })

    it('A blog can be deleted', function(){
      cy.createBlog({
        title: 'BlogX',
        author: 'BlogX Author',
        url: 'BlogX.com'
      })
      cy.contains('BlogX')
      cy.get('#hide-view').click()
      cy.get('#remove').click()
      cy.contains('BlogX by BlogX Author removed')
      cy.contains('Blog X BlogX Author').should('not.exist')
    })

    it('Delete button can only be seen by blog\'s creator', function(){
      cy.createBlog({
        title: 'BlogX',
        author: 'BlogX Author',
        url: 'BlogX.com'
      })
      cy.get('#logout-button').click()
      cy.contains('Logout successful')
      const user = {
        name: 'tester2',
        username: 'tester2',
        password: 'pass2'
      }
      cy.request('POST', `${Cypress.env('BACKEND')}/users`, user)
      cy.login({ username: 'tester2', password: 'pass2' })
      cy.get('#remove').should('not.exist')
    })

    it('order blogs by likes', function(){
      cy.createBlog({
        title: 'BlogX',
        author: 'Blog Author',
        url: 'BlogX.com',
        likes: 10
      })
      cy.createBlog({
        title: 'BlogY',
        author: 'BlogY Author',
        url: 'BlogY.com',
        likes: 20
      })
      cy.createBlog({
        title: 'BlogZ',
        author: 'BlogZ Author',
        url: 'BlogZ.com',
        likes: 15
      })
      cy.get('.blog-list').eq(0).should('contain', 'BlogY')
      cy.get('.blog-list').eq(1).should('contain', 'BlogZ')
      cy.get('.blog-list').eq(2).should('contain', 'BlogX')
    })
  })
})