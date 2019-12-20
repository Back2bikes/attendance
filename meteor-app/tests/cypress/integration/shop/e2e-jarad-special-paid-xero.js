// Checks xero payment with yearly membership

describe('Shopping Payment', function() {
  it('Choose Product', function() {
    cy.visit('/admin/userprofiles/')
    mkToughGuy()

    cy.get('input[name=email]')
      .clear()
      .type('admin@back2bikes.com.au')

    cy.get('input[name=password]')
      .clear()
      .type('me2')

    cy.get('button')
      .contains('Submit')
      .should('be.enabled')
      .click()
    cy.get('button[about="Tough Guy"]')
      .contains('Add...')
      .click()
    cy.get('button#memberships')
      .contains('Memberships')
      .should('exist')
      .click()
    cy.get('button#pa_12_month_membership')
      .should('exist')
      .click()
    cy.get('button#checkout')
      .should('exist')
      .click()
    // Admin promo code brings up form
    cy.get('input[name="promo"]')
      .should('exist')
      .click()
      .clear()
      .type('JARAD-ROOLS')
    cy.get('button#check')
      .should('exist')
      .click()
    cy.get('input[value="xero"]')
      .should('exist')
      .click()
    cy.get('input[name="date"]').should('exist')
    cy.get('button[id="doit"]')
      .should('exist')
      .click()
    cy.get('h2[class="ui header"')
      .contains('Paid')
      .should('exist')
    cy.visit('/admin/userprofiles/')
    cy.get('div[class="content"]')
      .contains('Tough Guy')
      .should('exist')
      .click()
    cy.get('div[class="ui grid member-card-container"]')
      .contains(
        'Expires ' +
          Cypress.moment()
            .add(1, 'years')
            .format('Do MMM YYYY')
      )
      .should('exist')
    cy.get('div[class="ui grid member-card-container"]')
      .contains('current member')
      .should('exist')
    cy.get('div[class=meta')
      .contains('status: complete xero')
      .should('exist')
    cy.get('div[class="content"]').contains('1 x PA-MEMB-12')
    // Remove the tough guy at the end
    rmToughGuy()
  })
})
