import { Meteor } from 'meteor/meteor'
import { withTracker } from 'meteor/react-meteor-data'
import React from 'react'
import DateEditor from 'react-tabulator/lib/editors/DateEditor'
import Members from '/imports/api/members/schema'
import Sessions from '/imports/api/sessions/schema'
import Events from '/imports/api/events/schema'
import List from './list'

const remove = id => Meteor.call('rm.Sessions', id)
const update = form => Meteor.call('update.Sessions', form)
const add = form => Meteor.call('add.Sessions', form)

const dateFormat = {
  inputFormat: 'DD/MM/YY hh:mm',
  outputFormat: 'DD/MM/YY h:mm A',
  invalidPlaceholder: 'Invalid Date'
}

const columns = [
  {
    formatter: 'rowSelection',
    align: 'center',
    headerSort: false,
    cellClick: function(e, cell) {
      cell.getRow().toggleSelect()
    }
  },
  { field: 'memberName', title: 'Member Name', editor: true },
  { field: 'name', title: 'Session Name', editor: true },
  { field: 'duration', title: 'Duration', editor: true },
  { field: 'timeIn', title: 'Start Time', editor: DateEditor, formatter: 'datetime', formatterParams: dateFormat },
  {
    field: 'timeOut',
    title: 'End Time',
    editor: DateEditor,
    formatter: 'datetime',
    formatterParams: dateFormat
  },
  { field: 'price', title: 'Price', editor: true }
]

export default withTracker(props => {
  const subsHandle = Meteor.subscribe('all.sessions')
  const membersHandle = Meteor.subscribe('all.members')
  const eventsHandle = Meteor.subscribe('all.events')

  return {
    items: Sessions.find({}).fetch(),
    members: Members.find({}).fetch(),
    events: Events.find({}).fetch(),
    remove,
    update,
    add,
    columns,
    loading: !subsHandle.ready()
  }
})(List)
