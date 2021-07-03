import SimpleSchema from 'simpl-schema'
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2'

import AvatarField from './avatar-field'

const aboutFormSchema = new SimpleSchema(
  {
    numBikes: {
      type: SimpleSchema.Integer,
      min: 0,
      label: 'Bikes owned',
      uniforms: {
        'ui:field-cols': 2,
        helperText: 'How many bikes are in your household?',
      },
    },
    preferedBike: {
      type: String,
      label: 'Main bike',
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
      uniforms: {
        'ui:field-cols': 2,
        helperText: 'What type of bike do you ride the most?',
      },
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
    },
    volunteerReasons: {
      type: String,
      max: 250,
      label: 'Reasons for volunteering',
      uniforms: {
        multiline: true,
        rows: 4,
        placeholder: [
          'What makes you want to to volunteer at Back2Bikes?',
          'Have you ever done any other volunteering before?',
          'Have you worked on bikes or something similar before?',
        ].join('\n'),
      },
    },
  },
  { requiredByDefault: false }
)

const contactFormSchema = new SimpleSchema({
  name: String,
  mobileNumber: {
    type: String,
    regEx: SimpleSchema.RegEx.Phone,
  },
  email: {
    type: String,
    regEx: SimpleSchema.RegEx.Email,
  },
  streetAddress: {
    type: String,
    optional: true,
  },
  suburb: {
    type: String,
    optional: true,
    uniforms: {
      'ui:field-cols': 2,
    },
  },
  state: {
    type: String,
    allowedValues: ['VIC', 'NSW', 'QLD', 'ACT', 'NT', 'WA', 'SA', 'TAS'],
    optional: true,
    uniforms: {
      'ui:field-cols': 1,
    },
  },
  postcode: {
    type: String,
    min: 4,
    max: 4,
    optional: true,
    uniforms: {
      'ui:field-cols': 1,
    },
  },
  pinNumber: {
    type: String,
    min: 4,
    max: 4,
    uniforms: {
      'ui:field-cols': 2,
    },
  },
  confirmPIN: {
    type: String,
    custom() {
      if (this.value !== this.field('pinNumber').value) {
        return 'pinMismatch'
      }
    },
    uniforms: {
      'ui:field-cols': 2,
    },
  },
})

const emergencyFormSchema = new SimpleSchema({
  emergencyContactName: String,
  emergencyContactEmail: {
    type: String,
    optional: true,
  },
  emergencyContactMobile: SimpleSchema.RegEx.Phone,
})

const avatarFormSchema = new SimpleSchema({
  avatar: {
    type: String,
    defaultValue: 'default.jpg',
    allowedValues: [
      'default.jpg',
      '1.jpg',
      '2.jpg',
      '3.jpg',
      '4.jpg',
      '5.jpg',
      '6.jpg',
      '7.jpg',
      '8.jpg',
      '9.jpg',
      '10.jpg',
      '11.jpg',
      '12.jpg',
      '13.jpg',
      '14.jpg',
      '15.jpg',
      '16.jpg',
      'test11.png',
      'test14.png',
      'test16.png',
      'test17.png',
      'test18.png',
      'test19.png',
      'test20.png',
      'test21.png',
      'test24.png',
      'test25.png',
      'test26.png',
      'test28.png',
      'test29.png',
    ],
    uniforms: {
      component: AvatarField,
    },
  },
})

const termsFormSchema = new SimpleSchema({
  agree: {
    type: Boolean,
    label:
      'I consent to Back2Bikes storing the information I have provided above. I understand that Back2Bikes will not disclose \
      the above information without my express consent other than for reasons related to my engagement as a volunteer.',
    defaultValue: false,
    custom() {
      if (this.value !== true) {
        return 'mustAgree'
      }
    },
  },
})

const contactFormBridge = new SimpleSchema2Bridge(contactFormSchema)
const aboutFormBridge = new SimpleSchema2Bridge(aboutFormSchema)
const emergencyFormBridge = new SimpleSchema2Bridge(emergencyFormSchema)
const avatarFormBridge = new SimpleSchema2Bridge(avatarFormSchema)
const termsFormBridge = new SimpleSchema2Bridge(termsFormSchema)

export {
  contactFormBridge,
  aboutFormBridge,
  emergencyFormBridge,
  avatarFormBridge,
  termsFormBridge,
}
