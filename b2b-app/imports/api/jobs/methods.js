import { Meteor } from 'meteor/meteor'
import { Accounts } from 'meteor/accounts-base'
import moment from 'moment'

import CONSTANTS from '../constants'
import ServiceItems from '/imports/api/service-items/schema.js'
import Jobs, {
  JobCreateParamsSchema,
  JobUpdateParamsSchema,
  JobUpdateStatusParamsSchema,
  JobUpdateMechanicParamsSchema,
  JobMarkAsPaidParamsSchema,
  JobAddHistoryParamsSchema,
  JobSendSMSParamsSchema,
} from './schema'
import Members from '/imports/api/members/schema.js'
import { hasOneOfRoles } from '/imports/api/users/utils.js'

const debug = require('debug')('b2b:jobs')

Meteor.methods({
  /**
   * Mark a job as paid
   * @param {Object} params
   * @param {string} params.id - the job id
   */
  'jobs.markAsPaid'({ id }) {
    try {
      JobMarkAsPaidParamsSchema.validate({ id })
    } catch (e) {
      debug(e.message)
      return { status: 'failed', message: e.message }
    }

    // check for login user
    if (!this.userId) {
      return { status: 'failed', message: 'Please login' }
    }
    const me = Meteor.users.findOne({ _id: this.userId })
    const allowed = hasOneOfRoles(me, ['ADM', 'GRE'])
    if (!allowed) {
      return { status: 'failed', message: 'Permission denied' }
    }
    // get current user profile
    const myMember = Members.findOne({ userId: me._id })

    // find the job
    const job = Jobs.findOne({ _id: id })
    if (!job) {
      return { status: 'failed', message: `Job was not found with id: ${id}` }
    }

    if (job.paid) {
      return { status: 'failed', message: 'Job has been paid already' }
    }

    // update the job and the history
    try {
      Jobs.update(
        { _id: id },
        {
          $set: { paid: true, paidAt: new Date() },
          $push: {
            history: {
              userId: me._id,
              memberId: myMember._id,
              description: `${myMember.name} mark the Job as paid`,
              statusBefore: job.status,
              statusAfter: job.status,
              createdAt: new Date(),
            },
          },
        }
      )
    } catch (e) {
      return { status: 'failed', message: e.message }
    }

    return {
      status: 'success',
    }
  },

  /**
   * update job mechanic
   * @param {Object} params
   * @param {string} params.id
   * @param {string} params.content
   */
  'jobs.sendSMS'({ id, message }) {
    try {
      JobSendSMSParamsSchema.validate({ id, message })
    } catch (e) {
      debug(e.message)
      return { status: 'failed', message: e.message }
    }

    // check for login user
    if (!this.userId) {
      return { status: 'failed', message: 'Please login' }
    }
    const me = Meteor.users.findOne({ _id: this.userId })
    const allowed = hasOneOfRoles(me, ['ADM', 'GRE'])
    if (!allowed) {
      return { status: 'failed', message: 'Permission denied' }
    }
    // get current user profile
    const myMember = Members.findOne({ userId: me._id })

    // find the job
    const job = Jobs.findOne({ _id: id })
    if (!job) {
      return { status: 'failed', message: `Job was not found with id: ${id}` }
    }

    // TODO: call some SMS sending function

    // update the status and the history
    try {
      Jobs.update(
        { _id: id },
        {
          $push: {
            history: {
              userId: me._id,
              memberId: myMember._id,
              description: `[${myMember?.name}] sent SMS: ${message}`,
              statusBefore: job.status,
              statusAfter: job.status,
              createdAt: new Date(),
            },
          },
        }
      )
    } catch (e) {
      return { status: 'failed', message: e.message }
    }

    return {
      status: 'success',
    }
  },

  /**
   * update job mechanic
   * @param {Object} params
   * @param {string} params.id
   * @param {string} params.description
   */
  'jobs.addHistory'({ id, description }) {
    try {
      JobAddHistoryParamsSchema.validate({ id, description })
    } catch (e) {
      debug(e.message)
      return { status: 'failed', message: e.message }
    }

    // check for login user
    if (!this.userId) {
      return { status: 'failed', message: 'Please login' }
    }
    const me = Meteor.users.findOne({ _id: this.userId })
    const allowed = hasOneOfRoles(me, ['ADM', 'GRE'])
    if (!allowed) {
      return { status: 'failed', message: 'Permission denied' }
    }
    // get current user profile
    const myMember = Members.findOne({ userId: me._id })

    // find the job
    const job = Jobs.findOne({ _id: id })
    if (!job) {
      return { status: 'failed', message: `Job was not found with id: ${id}` }
    }

    // update the status and the history
    try {
      Jobs.update(
        { _id: id },
        {
          $push: {
            history: {
              userId: me._id,
              memberId: myMember._id,
              description: `[${myMember?.name}] ${description}`,
              statusBefore: job.status,
              statusAfter: job.status,
              createdAt: new Date(),
            },
          },
        }
      )
    } catch (e) {
      return { status: 'failed', message: e.message }
    }

    return {
      status: 'success',
    }
  },

  /**
   * update job mechanic
   * @param {Object} params
   * @param {string} params.id
   * @param {string} params.mechanic user id
   */
  'jobs.updateMechanic'({ id, mechanic }) {
    try {
      JobUpdateMechanicParamsSchema.validate({ id, mechanic: mechanic || undefined })
    } catch (e) {
      debug(e.message)
      return { status: 'failed', message: e.message }
    }

    // check for login user
    if (!this.userId) {
      return { status: 'failed', message: 'Please login' }
    }
    const me = Meteor.users.findOne({ _id: this.userId })
    const allowed = hasOneOfRoles(me, ['ADM', 'GRE'])
    if (!allowed) {
      return { status: 'failed', message: 'Permission denied' }
    }
    // get current user profile
    const myMember = Members.findOne({ userId: me._id })

    // find the mechanic member
    const mechanicMember = Members.findOne({ userId: mechanic })
    if (mechanic && !mechanicMember) {
      return {
        status: 'failed',
        message: `Mechanic was not found with user id ${mechanic}`,
      }
    }

    // find the job
    const job = Jobs.findOne({ _id: id })
    if (!job) {
      return { status: 'failed', message: `Job was not found with id: ${id}` }
    }

    // update the status and the history
    try {
      Jobs.update(
        { _id: id },
        {
          $set: { mechanic },
          $push: {
            history: {
              userId: me._id,
              memberId: myMember._id,
              description: mechanic
                ? `${myMember.name} update job mechanic, new mechanic: ${mechanicMember.name} (${mechanicMember.userId})`
                : 'Deselect',
              statusBefore: job.status,
              statusAfter: job.status,
              createdAt: new Date(),
            },
          },
        }
      )
    } catch (e) {
      return { status: 'failed', message: e.message }
    }

    return {
      status: 'success',
    }
  },

  /**
   * update job status
   * @param {Object} params
   * @param {string} params.id
   * @param {string} params.status
   */
  'jobs.updateStatus'({ id, status }) {
    try {
      JobUpdateStatusParamsSchema.validate({ id, status })
    } catch (e) {
      debug(e.message)
      return { status: 'failed', message: e.message }
    }
    // check for login user
    if (!this.userId) {
      return { status: 'failed', message: 'Please login' }
    }
    const me = Meteor.users.findOne({ _id: this.userId })
    const allowed = hasOneOfRoles(me, ['ADM', 'GRE'])
    if (!allowed) {
      return { status: 'failed', message: 'Permission denied' }
    }
    // get current user profile
    const myMember = Members.findOne({ userId: me._id })

    // find the job
    const job = Jobs.findOne({ _id: id })
    if (!job) {
      return { status: 'failed', message: `Job was not found with id: ${id}` }
    }
    // check if new status is valid in status mapping
    const availableNextStatus = CONSTANTS.JOB_STATUS_MAPPING[job.status] || []
    if (!availableNextStatus.some((item) => item.next === status)) {
      debug('availableNextStatus', availableNextStatus)
      return { status: 'failed', message: `Job status was invalid: ${status}` }
    }
    // update the status and the history
    try {
      Jobs.update(
        { _id: id },
        {
          $set: { status },
          $push: {
            history: {
              userId: me._id,
              memberId: myMember._id,
              description: `${myMember.name} update job status, new status: ${CONSTANTS.JOB_STATUS_READABLE[status]}`,
              statusBefore: job.status,
              statusAfter: status,
              createdAt: new Date(),
            },
          },
        }
      )
    } catch (e) {
      return { status: 'failed', message: e.message }
    }

    return {
      status: 'success',
    }
  },

  /**
   * update job
   * @param {Object} data
   */
  'jobs.update'(data) {
    const cleanData = JobUpdateParamsSchema.clean(data)
    debug('clean data', cleanData.serviceItems, cleanData)
    try {
      JobUpdateParamsSchema.validate(cleanData)
    } catch (e) {
      debug(e.message)
      return { status: 'failed', message: e.message }
    }

    // check for login user
    if (!this.userId) {
      return { status: 'failed', message: 'Please login' }
    }
    const me = Meteor.users.findOne({ _id: this.userId })
    const allowed = hasOneOfRoles(me, ['ADM', 'GRE'])
    if (!allowed) {
      return { status: 'failed', message: 'Permission denied' }
    }

    // check for existing job
    const existingJob = Jobs.findOne({ _id: cleanData.jobId })
    if (!existingJob) {
      return {
        status: 'failed',
        message: `Job was not found with id: ${cleanData.jobId}`,
      }
    }

    const jobData = {
      // jobNo will be updated later
      name: cleanData.memberData?.name || undefined,
      phone: cleanData.memberData?.mobile || undefined,
      email: cleanData.memberData?.email || undefined,
      address: cleanData.memberData?.address || undefined,
      make: cleanData.bikeDetails.make,
      model: cleanData.bikeDetails.model,
      color: cleanData.bikeDetails.color,
      bikeType: cleanData.bikeDetails.type,
      bikeValue: cleanData.bikeDetails.approxValue,
      serviceItems: cleanData.serviceItems,
      totalCost: cleanData.serviceItems.reduce((a, b) => a + b.price, 0),
      dropoffDate: moment(cleanData.pickup.dropOffDate).toDate(),
      pickupDate: moment(cleanData.pickup.pickupDate).toDate(),
      urgent: cleanData.pickup.urgent,
      replacementBike: cleanData.pickup.replacementBike,
    }

    if (cleanData.selectedMember?._id) {
      jobData.memberId = cleanData.selectedMember._id
    }

    // update job
    try {
      Jobs.update(
        { _id: existingJob._id },
        {
          $set: jobData,
        }
      )
    } catch (e) {
      return { status: 'failed', message: e.message }
    }

    // update the member data
    if (cleanData.hasMember) {
      if (cleanData.selectedMember?._id) {
        // update the member data
        Members.update(
          { _id: cleanData.selectedMember._id },
          {
            $set: {
              name: cleanData.memberData.name,
              address: cleanData.memberData.address,
              mobile: cleanData.memberData.mobile,
              email: cleanData.memberData.email,
            },
          }
        )
      } else {
        // create member (without creating user)
        try {
          const insertedMemberId = Members.insert({
            name: cleanData.memberData.name,
            address: cleanData.memberData.address,
            mobile: cleanData.memberData.mobile,
            email: cleanData.memberData.email,
          })
          // update the job
          Jobs.update(
            { _id: existingJob._id },
            {
              $set: { memberId: insertedMemberId },
            }
          )
        } catch (e) {
          return { status: 'failed', message: e.message }
        }
      }
    }

    // TODO: update/create history

    // update the service-items, increase the numbersOfUsed value
    try {
      ServiceItems.update(
        { _id: { $in: data.serviceItems.map((item) => item._id) } },
        { $inc: { numbersOfUsed: 1 } },
        { multi: true }
      )
    } catch (e) {
      console.warn('Failed updating ServiceItems', e.message)
    }

    return { status: 'success' }
  },

  /**
   * create job
   * @param {Object} data
   */
  'jobs.create'(data) {
    const cleanData = JobCreateParamsSchema.clean(data)
    debug('clean data', cleanData.serviceItems, cleanData)
    try {
      JobCreateParamsSchema.validate(cleanData)
    } catch (e) {
      debug(e.message)
      return { status: 'failed', message: e.message }
    }

    // check for login user
    if (!this.userId) {
      return { status: 'failed', message: 'Please login' }
    }
    const me = Meteor.users.findOne({ _id: this.userId })
    const allowed = hasOneOfRoles(me, ['ADM', 'GRE'])
    if (!allowed) {
      return { status: 'failed', message: 'Permission denied' }
    }

    const jobData = {
      // jobNo will be updated later
      name: cleanData.memberData?.name || undefined,
      phone: cleanData.memberData?.mobile || undefined,
      email: cleanData.memberData?.email || undefined,
      address: cleanData.memberData?.address || undefined,
      make: cleanData.bikeDetails.make,
      model: cleanData.bikeDetails.model,
      color: cleanData.bikeDetails.color,
      bikeType: cleanData.bikeDetails.type,
      bikeValue: cleanData.bikeDetails.approxValue,
      serviceItems: cleanData.serviceItems,
      totalCost: cleanData.serviceItems.reduce((a, b) => a + b.price, 0),
      dropoffDate: moment(cleanData.pickup.dropOffDate).toDate(),
      pickupDate: moment(cleanData.pickup.pickupDate).toDate(),
      urgent: cleanData.pickup.urgent,
      replacementBike: cleanData.pickup.replacementBike,
    }

    if (cleanData.selectedMember?._id) {
      jobData.memberId = cleanData.selectedMember._id
    }

    // insert
    let inserted
    try {
      inserted = Jobs.insert(jobData)
    } catch (e) {
      return { status: 'failed', message: e.message }
    }

    // update the member data
    if (cleanData.hasMember) {
      if (cleanData.selectedMember?._id) {
        // update the member data
        Members.update(
          { _id: cleanData.selectedMember._id },
          {
            $set: {
              name: cleanData.memberData.name,
              address: cleanData.memberData.address,
              mobile: cleanData.memberData.mobile,
              email: cleanData.memberData.email,
            },
          }
        )
      } else {
        // create member (without creating user)
        try {
          const insertedMemberId = Members.insert({
            name: cleanData.memberData.name,
            address: cleanData.memberData.address,
            mobile: cleanData.memberData.mobile,
            email: cleanData.memberData.email,
          })
          // update the job
          Jobs.update(
            { _id: inserted },
            {
              $set: { memberId: insertedMemberId },
            }
          )
        } catch (e) {
          return { status: 'failed', message: e.message }
        }
      }
    }

    // TODO: update/create history

    // update the service-items, increase the numbersOfUsed value
    try {
      ServiceItems.update(
        { _id: { $in: data.serviceItems.map((item) => item._id) } },
        { $inc: { numbersOfUsed: 1 } },
        { multi: true }
      )
    } catch (e) {
      console.warn('Failed updating ServiceItems', e.message)
    }

    return { status: 'success', id: inserted }
  },
  'rm.jobs': (id) => {
    try {
      const n = Jobs.remove(id)
      return { status: 'success', message: 'Removed job' }
    } catch (e) {
      return {
        status: 'failed',
        message: `Error removing job: ${e.message}`,
      }
    }
  },
  'update.jobs': (form) => {
    try {
      const id = form._id
      delete form._id
      const n = Jobs.update(id, { $set: form })
      return { status: 'success', message: `Updated ${n} job(s)` }
    } catch (e) {
      return {
        status: 'failed',
        message: `Error updating job: ${e.message}`,
      }
    }
  },
  'insert.jobs': (form) => {
    try {
      const id = Jobs.insert(form)
      return { status: 'success', message: 'Added job' }
    } catch (e) {
      return {
        status: 'failed',
        message: `Error adding job: ${e.message}`,
      }
    }
  },
})
