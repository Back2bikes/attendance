import { Meteor } from 'meteor/meteor'
import { withTracker } from 'meteor/react-meteor-data'
import React from 'react'
import { useHistory } from 'react-router-dom'
import Events from '/imports/api/events/schema'
import { meteorCall } from '/imports/ui/utils/meteor'
import Add from './add'
import config from './config'

const debug = require('debug')('target:adder')
let push

const methods = {
  save: (form) => {
    meteorCall('insert.events', 'saving', form)
    push('/admin/events')
  },
}

const Loading = (props) => {
  push = useHistory()?.push
  if (props.loading) return <div>Loading...</div>
  return <Add {...props}></Add>
}
const Adder = withTracker((props) => {
  const defaultObject = config?.add?.defaultObject || {}
  return {
    item: defaultObject,
    methods,
    loading: false,
  }
})(Loading)
export default Adder
