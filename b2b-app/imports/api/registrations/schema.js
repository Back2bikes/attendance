import { Mongo } from 'meteor/mongo'
import SimpleSchema from 'simpl-schema'

import {
  OptionalRegExId,
  OptionalBlackbox,
  OptionalInteger,
  OptionalString,
  createdAt,
  updatedAt,
} from '/imports/api/utils/schema-util'

const Registrations = new Mongo.Collection('registrations')

export const RegistrationsSchema = new SimpleSchema({
  _id: OptionalRegExId,

  name: String,
  email: SimpleSchema.RegEx.Email,
  streetAddress: {
    type: String,
    optional: true,
  },
  suburb: {
    type: String,
    optional: true,
  },
  state: {
    type: String,
    allowedValues: ['VIC', 'NSW', 'QLD', 'ACT', 'NT', 'WA', 'SA', 'TAS'],
    optional: true,
  },
  postcode: {
    type: String,
    min: 4,
    max: 4,
    optional: true,
  },
  mobileNumber: SimpleSchema.RegEx.Phone,
  pinNumber: {
    type: String,
    min: 4,
    max: 4,
  },
  numBikes: {
    type: SimpleSchema.Integer,
    min: 0,
    label: 'How many bikes are in your household?',
    optional: true,
  },
  preferedBike: {
    type: String,
    label: 'What type of bike do you ride the most?',
    allowedValues: [
      'Moutain',
      'Road/Racer',
      'Hybrid',
      'BMX',
      'Ladies',
      'Gents',
      'Vintage',
      'Cruiser',
      'Fixie/Single Speed',
    ],
    optional: true,
  },
  workStatus: {
    type: String,
    allowedValues: [
      'Full Time',
      'Part Time',
      'Pension/Disability',
      'Unemployed',
      'Student',
      'Retired',
    ],
    optional: true,
  },
  volunteerReasons: {
    type: String,
    max: 250,
    label: 'Reasons for volunteering',
    optional: true,
  },
  emergencyContactName: String,
  emergencyContactEmail: {
    type: String,
    optional: true,
  },
  emergencyContactMobile: SimpleSchema.RegEx.Phone,

  createdAt,
  updatedAt,
})

Registrations.attachSchema(RegistrationsSchema)

export default Registrations
