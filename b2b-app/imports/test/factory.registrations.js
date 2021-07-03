import faker from 'faker'
import { Factory } from 'meteor/dburles:factory'
import { Random } from 'meteor/random'
import CONSTANTS from '/imports/api/constants'
import Registrations from '/imports/api/registrations/schema'

Factory.define('registrations', Registrations, {})
