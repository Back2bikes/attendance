import faker from 'faker'
import { Factory } from 'meteor/dburles:factory'
import { Random } from 'meteor/random'
import CONSTANTS from '/imports/api/constants'
import Sessions from '/imports/api/sessions/schema'

Factory.define('sessions', Sessions, {})
