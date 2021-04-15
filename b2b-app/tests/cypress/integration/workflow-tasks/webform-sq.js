import 'cypress-fill-command'
import users from '/tests/cypress/fixtures/users.json'
import listings from '/tests/cypress/fixtures/listings'
const address = listings.easy.address

Cypress.on('uncaught:exception', (err, runnable) => {
  // returning false here prevents Cypress from
  // failing the test. We do this because of some ugly js errors
  // from a js library we are    using
  return false
})

describe('Sellers questionnaire web form (mini-workflow)', () => {
  before(function () {
    freshDatabase()
    cy.window().then(async (win) => {
      await win.Meteor.callAsync('cleanup.listing', listings.easy.address)
    })
    cy.wait(4000)
  })
  afterEach(function () {
    if (this.currentTest.state === 'failed') {
      Cypress.runner.stop()
    }
  })
  it('Adds a property and completes the seller questionnaire', () => {
    cy.visit('/properties')
    cy.get('h1').should('contain', 'Log in')
    login(users.customer.username, users.customer.password)
    cy.window().then(async (win) => {
      listings.easy.slug = 'test-sq'
      const response = await win.Meteor.callAsync('launch.job', listings.easy)
    })
    cy.get('a[href="/properties"]').should('exist').click()
    cy.get('.address > a').then((element) => {
      cy.wrap(element).invoke('text').should('contain', address)
      cy.wrap(element).click()
    })
    cy.get('button#seller-q').should('exist').click()
    cy.get('#start-webform').should('be.enabled').click()
    cy.get('[value=individual]').click()
    cy.get('#individual-name').clear().type(users.existingCustomer.name)
    cy.get('#individual-email').clear().type(users.existingCustomer.username)
    cy.get('#individual-mobile').clear().type(users.existingCustomer.phone)
    cy.get('input[name=individual-residential]')
      .clear()
      .type(address)
      .blur()
      .should('have.attr', 'value', address)
    cy.get('input[name=individual-postal]')
      .clear()
      .type(address)
      .blur()
      .should('have.attr', 'value', address)

    cy.WebformPressNext()

    // STEP 2 - TITLE CERTIFICATE DETAILS
    cy.get('[name="haveTitle"][value="1"]').click()
    cy.get('#title-volume').clear().type('00000')
    cy.get('#title-folio').clear().type('000')
    cy.get('[name="titleHolder"][value="bank"]').click()
    cy.WebformPressNext()

    // STEP 3 - MORTGAGE DETAILS
    cy.get('[name="haveMortgage"][value="1"]').click()
    cy.get('#mortgage-bankname').clear().fill('Bank of means')
    cy.get('#mortgage-account').clear().fill('111-222-333')
    cy.get('[name=mortgage-address]').clear().type('499 Bourke St, Melbourne VIC 3000')
    cy.get('#mortgage-contact').clear().fill('Mr Banks')
    cy.get('#mortgage-bankphone').clear().fill('0444-444-4444')
    cy.get('#mortgage-email').clear().fill('mr.banks@bankofmeans.com.au')
    cy.WebformPressNext()

    // STEP 3 - DEPOSIT RELEASE
    cy.get('[name="depositRelease"][value="1"]').click()
    cy.WebformPressNext()

    // STEP 4 - QUESTIONS
    const fields = 'roads infestation flooding contamination reserves construction boundaries commonWalls fencing easements'.split(
      /\s+/
    )
    fields.forEach((field) => {
      cy.get(`[name="${field}"][value="1"]`).click()
      cy.get(`[name="${field}-1-specify"]`).clear().fill(`Details about ${field}`)
    })
    cy.WebformPressNext()

    //STEP 5 GST
    cy.get('[name="gst"][value="0"]').click()
    cy.WebformPressNext()

    //STEP 6 TENANTS
    cy.get('[name="leased"][value="0"]').click()
    cy.WebformPressNext()

    //STEP 7 SEWERAGE AND WATER
    cy.get('[name="sewerage"][value="1"]').click()
    cy.get('[name="septic"][value="0"]').click()
    cy.WebformPressNext()

    //STEP 7 IMPROVEMENTS AND BUILDINGS
    cy.get('[name="poolOrSpa"][value="1"]').click()
    cy.get('[name="poolFenced"][value="0"]').click()
    cy.get('[name="smokeAlarms"][value="0"]').click()
    cy.get('[name="renovated"][value="1"]').click()
    cy.get('#docs-buildingApproval').click()
    cy.get('#docs-occupancyCertificate').click()
    cy.get('#docs-warrantyInsurance').click()
    cy.get('#docs-complianceCertificate').click()
    cy.get('#docs-other').click()
    cy.WebformPressNext()

    // STEP 8 HERITAGE OVERLAY
    cy.get(`[name="heritage"][value="1"]`).click()
    cy.get(`[name="heritage-1-specify"]`).clear().type(`Details about heritage overlay`)
    cy.WebformPressNext()

    // // STEP 9 HERITAGE OVERLAY
    // cy.get(`[name="heritage"][value="1"]`).click()
    // cy.get(`[name="heritage-1-specify"]`).clear().type(`Details about heritage overlay`)
    // cy.WebformPressNext()

    // STEP 11 BILLS
    cy.get('#bills-water').type('2021-06-01')
    cy.get('#bills-rates').type('2021-06-01')
    cy.get('#bills-landtax').type('2021-06-01')
    cy.get('#bills-ownerscorp').type('2021-06-01')
    cy.get(`[name="haveOwnersCorp"][value="1"]`).click()
    cy.get('#ownersCorp-manager').fill('Jan I Tor')
    cy.get('[name=ownersCorp-address]').clear().fill('1 Owners St, Corpville KY 22222')
    cy.WebformPressNext()

    // STEP 12 OUTGOINGS
    cy.get('[name=councilRates][value=1]').click()
    cy.get('[name=waterRates][value=1]').click()
    cy.WebformPressNext()

    // STEP 13 BUILDING ORDERS AND NOTICES
    cy.get(`[name="buildingOrder"][value="1"]`).click()
    cy.get(`[name="notices-details"]`).clear().fill(`Details about building orders`)
    cy.WebformPressNext()

    // STEP 14 CHATTELS
    cy.get(`[name="chattels"][value="1"]`).click()
    cy.get(`[name="chattels-1-specify"]`)
      .clear()
      .fill(`Details about chattels and fittings`)
    cy.WebformPressNext()
    cy.SubmitWebform(true)
  })

  // it('Completes the "Finished" task', () => {
  //   cy.visit('/properties')
  //   cy.get('h1').should('contain', 'Log in')
  //   login(users.customer.username, users.customer.password)
  //   cy.wait(400)
  //   cy.get('h1').contains('My properties').should('exist')
  // cy.get('a[href="/properties"]')
  //     .should('exist')
  //     .click()
  //   cy.get('.address > a').then((element) => {
  //     cy.wrap(element).invoke('text').should('contain', address)
  //     cy.wrap(element).click()
  //   })
  //   // cy.get('.current > button').then((element) => {
  //   //   cy.wrap(element).invoke('text').should('contain', 'Finished')
  //   //   cy.wrap(element).click()
  //   // })
  //   cy.get('button#fini').should('exist').click()
  //   cy.get('button#checklist').should('exist').click()
  //   cy.get('h1').contains('Finished').should('exist')
  //   cy.get('input#done').should('exist').click()
  //   cy.get('button#complete').should('exist').click()
  //   // Wait for confirmation of the step being completed
  //   cy.get('div.MuiCardHeader-root').contains('Finished').should('exist')
  // })
})