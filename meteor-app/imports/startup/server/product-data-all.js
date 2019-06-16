import { Meteor } from 'meteor/meteor' // base
import Products, { ProductTypes } from '/imports/api/products/schema'

import paProducts from './product-data-pa'
import b2bProducts from './product-data-b2b'
import Events from '/imports/api/events/schema'

const config = [
  {
    collection: Products,
    element: 'products'
  },
  {
    collection: ProductTypes,
    element: 'productTypes'
  },
  {
    collection: Events,
    element: 'events'
  }
]

const fixtures = {
  pa: paProducts,
  b2b: b2bProducts
}

Meteor.methods({
  'seed.products': function(orgid, target) {
    try {
      if (!orgid) throw new Meteor.Error('Orgid not supplied')
      const data = fixtures[orgid]
      if (data && data[target]) {
        config.forEach(item => {
          if (item.element === target) {
            data[target].forEach(record => {
              item.collection.insert(record)
            })
          }
        })
      }
    } catch (e) {
      console.log(e)
    }
  },
  'update.products': function(orgid, target) {
    try {
      if (!orgid) throw new Meteor.Error('Orgid not supplied')
      const data = fixtures[orgid]
      if (data && data[target]) {
        config.forEach(item => {
          if (item.element === target) {
            data[target].forEach(record => {
              const rec = item.collection.findOne({ code: record.code })
              console.log(`Checking ${target}`, rec)
              if (!rec) {
                console.error(`Could not find record for ${record.code}`)
              } else {
                if (!rec.subsType) {
                  item.collection.update({ code: record.code }, { $set: { subsType: record.subsType } })
                }
              }
            })
          }
        })
      }
    } catch (e) {
      console.log(e)
    }
  }
})

Meteor.startup(() => {
  config.forEach(item => {
    if (item.collection.find().count() === 0) {
      Meteor.call('seed.products', Meteor.settings.public.orgid, item.element)
    }
  })
  Meteor.call('update.products', Meteor.settings.public.orgid, 'products')
})
