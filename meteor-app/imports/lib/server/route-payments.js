import { Meteor } from 'meteor/meteor'
import express from 'express'
import bodyParser from 'body-parser'
import moment from 'moment'
import CONSTANTS from '/imports/api/constants'
import Members from '/imports/api/members/schema'
import Purchases from '/imports/api/purchases/schema'
import { Carts } from '/imports/api/products/schema'

const debug = require('debug')('b2b:server-payments')

async function acceptPayment(req, res) {
  // We need to bind to the Meteor environment for this to work.
  Meteor.bindEnvironment(() => {
    if (req.body.data && req.body.data.metadata) debug('/payment hook, metadata', req.body.data.metadata)
    try {
      // First check the authentication, see here: https://pinpayments.com/developers/integration-guides/webhooks
      // req.body.data.metadata.cartId will contain the id of the cart.
      //Find the cart, and then create a purchase record from the contents of the cart
      const cartId = req.body.data.metadata.cartid
      const cart = Carts.findOne(cartId)
      if (!cart) {
        console.error(`Could not find cart with id ${cartId}`) // This is a kind-of normal condition
      } else {
        const member = Members.findOne(cart.memberId) || {}
        debug(`Processing ${cart.products.length} products from cart ${cartId}`)
        cart.products.forEach(prod => {
          debug(prod)
          // Work out the start date
          const startDate = prod.expiry || moment()
          // Calculate expiry from product duration (in months)
          const expiry = moment(startDate)
            .add(prod.duration, 'month')
            .toDate()
          const remaining = prod.qty || 1
          const purchase = {
            productName: prod.name,
            memberId: cart.memberId,
            price: prod.price,
            code: prod.code,
            productId: prod._id,
            purchaser: member.name,
            remaining,
            expiry,
            txnDate: new Date()
          }
          debug('Inserting purchase', purchase)
          const n = Purchases.insert(purchase)
          // Now update  the member status
          Members.update(cart.memberId, {
            $set: {
              status: 'current',
              subsType: prod.subsType,
              expiry
            }
          })
        })
      }
    } catch (e) {
      console.error(e)
    }
  })()

  res.status(200).json({ status: 'ok' })
}

export function setupPaymentsApi() {
  debug('Setting up payment hooks')
  const app = express()
  app.use(bodyParser.json({ extended: false }))

  app.post('/payment', acceptPayment)
  app.get('/api', (req, res) => {
    res.status(200).json({ message: 'B2B Payments API' }) // Shouldn't call this, just for testing for now
  })

  WebApp.connectHandlers.use(app)
}
