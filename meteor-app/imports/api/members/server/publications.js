import { Meteor } from 'meteor/meteor'
import Members from '../schema'
import Purchases from '../../purchases/schema'

Meteor.publish('all.members', () => {
  return Members.find({}, { sort: { joined: -1, lastIn: -1, name: 1 } })
})

// This one isn't used, but it probably should be :)
Meteor.publish('members.names', () => {
  return Members.find({}, { fields: { name: 1 }, sort: { joined: -1, lastIn: -1, name: 1 } })
})

Meteor.publish('member', id => {
  return [Members.find(id), Purchases.find({ memberId: id })]
})
