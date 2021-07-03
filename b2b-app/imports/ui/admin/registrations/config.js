import SimpleSchema from 'simpl-schema'
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2'
import {
  OptionalRegExId,
  RegExId,
  OptionalString,
  OptionalBlackbox,
  OptionalInteger,
} from '/imports/api/utils/schema-util'

const dateFormat = {
  inputFormat: 'DD/MM/YY hh:mm',
  outputFormat: 'DD/MM/YY h:mm A',
  invalidPlaceholder: '',
}

const editSchema = new SimpleSchema({
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
  emergencyContactName: String,
  emergencyContactEmail: {
    type: String,
    optional: true,
  },
  emergencyContactMobile: SimpleSchema.RegEx.Phone,
})

//
// Configuration to control display of individual records in a table
//
export default config = {
  view: {
    header: true, // Displays a heading row
    rows: [
      // Array of field names and display labels
      { field: 'name', label: 'Name' },
      { field: 'email', label: 'email' },
      { field: 'mobileNumber', label: 'mobile' },
      { field: 'streetAddress', label: 'street address' },
      { field: 'suburb', label: 'suburb' },
      { field: 'postcode', label: 'postcode' },
      { field: 'emergencyContactName', label: 'emergency contact' },
      { field: 'emergencyContactEmail', label: 'emergency email' },
      { field: 'emergencyContactMobile', label: 'emergency mobile' },
    ],
  },
  edit: { schema: new SimpleSchema2Bridge(editSchema) },
  list: {
    columns: [
      { field: 'name', title: 'name', editor: true, formatter: null },
      { field: 'email', title: 'email', editor: true, formatter: null },
      { field: 'mobileNumber', title: 'mobile', editor: true, formatter: null },
    ],
  },
  add: {
    defaultObject: {},
  },
}
