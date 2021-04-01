import { Meteor } from 'meteor/meteor'
import moment from 'moment'

import Events from './schema'
import CONSTANTS from '/imports/api/constants'
import log, { createLog } from '/imports/lib/log'
import MessageTemplates from '/imports/api/message-templates/schema'
import { convertMergeTags, convertLink } from '/imports/api/util.js'
import { push } from '/imports/api/notifications/server/helper.js'
import HTMLTemplate from '/imports/api/email-template'

const debug = require('debug')('target:events')

Meteor.methods({
  'rm.events': (id) => {
    try {
      const n = Events.remove(id)
      return { status: 'success', message: 'Removed event' }
    } catch (e) {
      return {
        status: 'failed',
        message: `Error removing event: ${e.message}`,
      }
    }
  },
  'update.events': (form) => {
    try {
      const id = form._id
      delete form._id
      const n = Events.update(id, { $set: form })
      return { status: 'success', message: `Updated ${n} event(s)` }
    } catch (e) {
      return {
        status: 'failed',
        message: `Error updating event: ${e.message}`,
      }
    }
  },
  'insert.events': (form) => {
    try {
      const id = Events.insert(form)
      return { status: 'success', message: 'Added event' }
    } catch (e) {
      return {
        status: 'failed',
        message: `Error adding event: ${e.message}`,
      }
    }
  },
  sendEvent({
    user,
    profile,
    people = [],
    slug = CONSTANTS.UNKNOWN_EVENT,
    emailLink,
    emailMessage,
  }) {
    try {
      const event =
        Events.findOne({ slug }) || Events.findOne({ slug: CONSTANTS.UNKNOWN_EVENT })
      if (!event) {
        log.error(`Could not find event ${slug}`)
        return null
      }
      // 'user' is the user doing the action
      // if user is already in 'people' array
      if (people.some((roleObj) => roleObj._id === user._id)) {
        people.forEach((person) => {
          if (person._id === user._id) {
            // override all other roles
            person.roles = [{ _id: 'USR' }]
          }
        })
      } else {
        user.name = profile?.name
        user.mobile = profile?.mobile
        user.avatar = profile?.avatar
        user.roles = [{ _id: 'USR' }]
        people.push(user)
      }
      const { notifications } = event
      notifications.forEach((notification) => {
        // Find the corresponding template (recipients are in the notification)
        const template = MessageTemplates.findOne({ slug: notification.text })
        if (!template)
          throw new Meteor.Error(`Could not find message template: ${notification.text}`)
        let body
        let form
        let url
        let filteredPeople = people.filter((person) => {
          return person.roles.some((roleObj) => {
            return notification.recipients.includes(roleObj._id)
          })
        })
        // Check if the notification is APP, EMAIL or SMS
        switch (template.type) {
          case 'APP':
            // The filtered people are now the recipients of the current notification
            filteredPeople.forEach((recipient) => {
              body = convertMergeTags(template.body, {
                nickname: notification.userInfo ? user?.name : recipient?.name,
                address: 'Address',
                type: 'Transaction type',
                // this only works for 1 role (when signing up)
                userName: user.name || 'User',
                role:
                  user.roles[0]._id === 'USR'
                    ? 'Customer'
                    : CONSTANTS.ROLES[user.roles[0]._id],
                email: user.emails[0].address || 'Email',
              })

              url = null

              push({
                userId: recipient._id,
                message: body,
                data: {
                  user: {
                    avatar: notification.userInfo ? user.avatar : recipient.avatar,
                    name: recipient.name,
                  },
                },
                url,
              })
            })
            break
          case 'EMAIL':
            filteredPeople.forEach((recipient) => {
              body = convertMergeTags(template.body, {
                nickname: recipient?.name || 'User',
                address: 'Address',
                type: 'Type',
                // this role and email only works for new signups (1 role)
                // defaults to Customer if role is USR
                name: user?.name || 'User',
                role:
                  user.roles[0]._id === 'USR'
                    ? 'Customer'
                    : CONSTANTS.ROLES[user.roles[0]._id],
                email: user?.emails[0]?.address || 'Email',
                timestamp: moment().format('DD/MM/YY hh:mm'),
                url: emailLink ? emailLink : '',
                message: emailMessage ? emailMessage : '',
              })
              // Create the form
              form = {
                type: 'email',
                to: recipient.emails[0].address,
                subject: template.subject,
                body: HTMLTemplate.replace('*|contents|*', body).replace(
                  '*|subject|*',
                  template.subject || ''
                ),
                data: {
                  html: HTMLTemplate.replace('*|contents|*', body).replace(
                    '*|subject|*',
                    template.subject || ''
                  ),
                  subject: template.subject,
                  from_email: 'do-not-reply@settleeasy.com.au',
                  from_name: 'Settle Easy',
                  to: [
                    {
                      email: recipient.emails[0].address,
                      name: recipient?.name || 'User',
                    },
                  ],
                  headers: {
                    'Reply-To': 'do-not-reply@settleeasy.com.au',
                  },
                  important: true,
                  // bcc_address: 'do-not-reply@settleeasy.com.au',
                  tags: [event.slug],
                  recipient_metadata: [
                    { rcpt: 'do-not-reply@settleeasy.com.au', values: { some: 'value' } },
                  ],
                },
              }

              // Send the form
              Meteor.call('insert.messages', form)
            })
            break
          case 'SMS':
            filteredPeople.forEach((recipient) => {
              body = convertMergeTags(template.body, {
                nickname: recipient?.name || 'User',
                address: 'Address',
                type: 'Type',
              })

              // Create the form
              form = {
                type: 'sms',
                to: recipient.mobile,
                subject: 'message from SettleEasy',
                body: body,
                data: {
                  recipient: recipient.mobile,
                  sender: 'SettleEasy',
                  message: body,
                },
              }

              // Send the form
              Meteor.call('insert.messages', form)
            })
            break
          default:
            throw new Meteor.Error('An error has occurred')
        }
      })
    } catch (e) {
      // Log the error, but don't rethrow it
      log.error(`Error in sendEvent: ${e.message}`)
    }
  },
})
