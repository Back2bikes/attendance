import React from 'react'
import PropTypes from 'prop-types'
import { Button, Segment, Modal, Form, Dropdown } from 'semantic-ui-react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import 'react-tabulator/lib/styles.css'
import 'react-tabulator/lib/css/tabulator.min.css'
import { ReactTabulator } from 'react-tabulator'

const debug = require('debug')('manx:add')

const List = ({ items, members, events, update, remove, add, columns, loading }) => {
  const [rows, setRows] = React.useState(items)
  const [rowsSelected, setRowsSelected] = React.useState([])
  const [sessionDate, setSessionDate] = React.useState(new Date())
  const [modalOpen, setModalOpen] = React.useState(false)

  React.useEffect(() => {
    setRows(items)
    setRowsSelected([])
  }, [items])

  const onCellEdited = cell => {
    debug('cellEdited', cell)
    update(cell._cell.row.data)
  }

  const tableOptions = {
    cellEdited: onCellEdited,
    width: 100,
    rowSelected: function(row) {
      rowsSelected.push(row._row.data._id)
      setRowsSelected(rowsSelected)
    },
    rowDeselected: function(row) {
      for (i = 0; i < rowsSelected.length; i++) {
        if (rowsSelected[i] === row._row.data._id) {
          rowsSelected.splice(i, 1)
          setRowsSelected(rowsSelected)
        }
      }
    }
  }

  const inputChange = e => {
    console.log(events)
    rows[e.target.name] = e.target.value
    setRows(rows)
  }

  const inputMember = (_, { value }) => {
    rows['memberName'] = value
    setRows(rows)
  }

  const inputEvent = (_, { value }) => {
    rows['name'] = value
    //Only works if name is unique
    selectedEvent = events.find(event => event.name === value)
    rows['duration'] = selectedEvent.duration
    rows['price'] = selectedEvent.price
    setRows(rows)
  }

  const addANewRow = () => {
    rows['timeIn'] = sessionDate
    add({ ...rows })
    setModalOpen(false)
  }

  const deleteRows = () => {
    for (i = 0; i < rowsSelected.length; i++) {
      remove(rowsSelected[i])
    }
  }

  let Contents = () => <span>Loading...</span>
  if (!loading) {
    if (!rows.length) {
      Contents = () => <span>No data found</span>
    } else {
      Contents = () => (
        <ReactTabulator columns={columns} data={items} options={tableOptions} cellEdited={onCellEdited} />
      )
    }
  }

  const memberOptions = members.map(member => ({
    key: member.name,
    text: member.name,
    value: member.name,
    image: { avatar: true, src: '/images/avatars/' + member.avatar }
  }))

  const eventOptions = events.map(event => ({
    key: event.id,
    text: event.name,
    value: event.name
  }))

  return (
    <div>
      <Segment>
        Sessions list
        <span style={{ float: 'right', right: '0px' }}>
          <DatePicker
            selected={sessionDate}
            dateFormat="dd/MM/yyyy h:mm aa"
            onChange={date => setSessionDate(date)}
            showTimeSelect
          />
          <Button size="mini" onClick={deleteRows} color="red" type="button">
            Delete
          </Button>
          <Modal
            style={{ marginTop: '0px', marginLeft: 'auto', marginRight: 'auto' }}
            open={modalOpen}
            onClose={() => setModalOpen(false)}
            trigger={
              <Button size="mini" color="black" onClick={() => setModalOpen(true)}>
                Add
              </Button>
            }
          >
            <Modal.Header>Add an attendee</Modal.Header>
            <Modal.Content>
              <Form>
                <Form.Dropdown
                  label="Member Name"
                  placeholder="Select Member"
                  onChange={inputMember}
                  options={memberOptions}
                  search
                  fluid
                />
                <Form.Dropdown
                  label="Session Name"
                  placeholder="Select Session"
                  onChange={inputEvent}
                  options={eventOptions}
                  search
                  fluid
                />
                <Button onClick={addANewRow} type="submit" color="green">
                  Save
                </Button>
              </Form>
            </Modal.Content>
          </Modal>
        </span>
      </Segment>
      <Contents />
    </div>
  )
}

List.propTypes = {
  loading: PropTypes.bool.isRequired,
  items: PropTypes.array,
  members: PropTypes.array,
  events: PropTypes.array,
  remove: PropTypes.func.isRequired,
  update: PropTypes.func.isRequired,
  add: PropTypes.func.isRequired
}
export default List