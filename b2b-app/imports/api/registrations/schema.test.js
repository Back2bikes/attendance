// schema.test.js

/* eslint-disable no-unused-expressions */

import { resetDatabase } from '/imports/test/util-test'
import { expect } from 'chai'

import Registrations from './schema'
import Factory from '/imports/test/factories'
import '/imports/test/factory.registrations'

const badRegistrations = [
  // no name
  {},
]

const goodRegistrations = []

goodRegistrations.push(Factory.build('registrations'))

describe('registrations', () => {
  goodRegistrations.forEach((good, i) => {
    describe('query database good registrations', () => {
      // beforeEach(resetDatabase)
      it('success if database query matches', () => {
        const id = Registrations.insert(good)
        const thing = Registrations.findOne(id)
        const fields = ["name","schema","description","active"] || []
        fields.forEach((field) => {
          expect(thing[field]).to.equal(good[field])
        })
      })
    })
  })
  badRegistrations.forEach((bad, i) => {
    describe('RegistrationsSchema bad registrations', () => {
      it(`Succeeds on BAD Registrations insert ${i + 1}`, () => {
        expect(() => Registrations.insert(bad)).to.throw()
      })
    })
  })
})
