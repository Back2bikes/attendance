import { Meteor } from 'meteor/meteor'
import Registrations from './schema'
const debug = require('debug')('target:registrations')

Meteor.methods({
  'rm.registrations': (id) => {
    try {
      const n = Registrations.remove(id)
      return { status: 'success', message: `Removed registration` }
    } catch (e) {
      return {
        status: 'failed',
        message: `Error removing registration: ${e.message}`,
      }
    }
  },
  'update.registrations': (form) => {
    try {
      const id = form._id
      delete form._id
      const n = Registrations.update(id, { $set: form })
      return { status: 'success', message: `Updated ${n} registration(s)` }
    } catch (e) {
      return {
        status: 'failed',
        message: `Error updating registration: ${e.message}`,
      }
    }
  },
  'insert.registrations': (form) => {
    try {
      const id = Registrations.insert(form)
      return { status: 'success', message: `Added registration` }
    } catch (e) {
      return {
        status: 'failed',
        message: `Error adding registration: ${e.message}`,
      }
    }
  },
})
