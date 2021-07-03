import { Mongo } from 'meteor/mongo'
import SimpleSchema from 'simpl-schema'

import {
  OptionalRegExId,
  Blackbox,
  OptionalBlackbox,
  OptionalInteger,
  OptionalString,
  createdAt,
  updatedAt,
} from '/imports/api/utils/schema-util'

const MyCollection = new Mongo.Collection('myCollection')

export const MyCollectionSchema = new SimpleSchema({
  _id: OptionalRegExId,

  TEMPLATED_COLUMNS,

  createdAt,
  updatedAt,
})

MyCollection.attachSchema(MyCollectionSchema)

export default MyCollection
