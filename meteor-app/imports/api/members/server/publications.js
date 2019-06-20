import { Meteor } from 'meteor/meteor'
import Members from '../schema'
import Purchases from '../../purchases/schema'
import Sessions from '../../sessions/schema'
import Products, { Carts } from '../../products/schema'
import Events from '../../events/schema'

Meteor.publish('all.members', () => {
  return Members.find({}, { sort: { joined: -1, lastIn: -1, name: 1 } })
})

Meteor.publish('all.members.carts', () => {
  return [Members.find({}, { sort: { joined: -1, lastIn: -1, name: 1 } }), Carts.find({})]
})

// This one isn't used, but it probably should be :)
Meteor.publish('members.names', () => {
  return Members.find({}, { fields: { name: 1 }, sort: { joined: -1, lastIn: -1, name: 1 } })
})

Meteor.publish('member', id => {
  return [Members.find(id), Purchases.find({ memberId: id }), Events.find()]
})

Meteor.publish('member.renew', (id, cartId) => {
  return [Members.find(id), Purchases.find({ memberId: id }), Products.find({ active: true }), Carts.find(cartId)]
})

Meteor.publish('member.all', id => {
  return [
    Members.find(id),
    Purchases.find({ memberId: id }),
    Carts.find({ memberId: id }),
    Sessions.find({ memberId: id })
  ]
})
