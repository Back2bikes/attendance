const pin = '1234'

describe('Shopping Payment', function() {
  it('Choose Product', function() {
    cy.visit('/admin/userprofiles/')

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

    //cy.get('button[about="Mike King"]')
    cy.get('button[about="Dorothea Kovacek"]')
      .contains('Add...')
      .click()
    cy.get('button#multi_pass')
      .contains('Multi pass')
      .should('exist')
      .click()
    cy.get('button#pa_casual_session')
      .should('exist')
      .click()
    cy.get('button#checkout')
      .should('exist')
      .click()
    // Clear out last run (and this one)
    cy.get('button#rm_pa_casual').click()
    // Continue shopping
    cy.get('button#continue').click()
    // Start again
    cy.get('button#multi_pass')
      .contains('Multi pass')
      .should('exist')
      .click()
    cy.get('button#pa_casual_session')
      .should('exist')
      .click()
    cy.get('button#checkout')
      .should('exist')
      .click()
    // No promo code
    cy.get('input[name="promo"]')
      .should('exist')
      .click()
      .clear()
    cy.get('button#check')
      .should('exist')
      .click()
    cy.get('div')
      .contains('Please enter a discount code')
      .should('exist')
    // Bad code
    cy.get('input[name="promo"]')
      .should('exist')
      .click()
      .clear()
      .type('BAD-BAD-BAD')
    cy.get('button#check')
      .should('exist')
      .click()
    cy.get('div')
      .contains('not found')
      .should('exist')
    // Valid discount code
    cy.get('input[name="promo"]')
      .should('exist')
      .click()
      .clear()
      .type('PA-10-PERCENT')
    cy.get('button#check')
      .should('exist')
      .click()
    cy.get('div')
      .contains('Yay!')
      .should('exist')
    // Admin promo code brings up form
    cy.get('input[name="promo"]')
      .should('exist')
      .click()
      .clear()
      .type('JARAD-ROOLS')
    cy.get('button#check')
      .should('exist')
      .click()
    cy.get('div.label').contains('Charge: $20')
    cy.get('input[name="discount"]')
      .click()
      .clear()
      .type('50%')

    // oringinal code: cy.get('div.label').contains('Charge: $10')
    cy.get('div.label').contains('Charge: $-30')
    cy.get('input[type="radio"][value="email"]').click()
    cy.get('input[name="email"]')
      .invoke('val')
      .should('contain', 'London_Abshire@Jayde.tv')
    cy.get('input[type="radio"][value="paypal"]').click()
    cy.get('input[name="date"]')
      .click()
      .clear()
      .type('12/13/2019')
    // finds the radio buttons and selects them
    cy.get('input[type="radio"][value="xero"]').click()
    cy.get('input[name="date"')
    cy.get('input[type="radio"][value="cash"]').click()
    cy.get('input[name="date"').clear()
    cy.get('input[type="radio"][value="charge"]').click()
    cy.get('button')
      .contains('Cancel')
      .click()
    // Clear out last run (and this one)
    cy.get('button#rm_pa_casual').click()
    cy.get('button#continue').click()
    cy.visit('/admin/userprofiles/')
  })
})
