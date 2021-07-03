import React from 'react'
import { useHistory } from 'react-router-dom'
import PropTypes from 'prop-types'
import moment from 'moment'
import Button from '@material-ui/core/Button'
import { Box, Container, Grid, Typography } from '@material-ui/core'
import { AutoForm, AutoFields, LongTextField, SubmitField } from 'uniforms-material'
import { CustomAutoField } from '/imports/ui/components/forms'
import config from './config'

const schemaBridge = config.edit.schema
const debug = require('debug')('target:add')

const Add = ({ item, methods }) => {
  const save = (model) => {
    try {
      methods.save(model)
    } catch (e) {
      alert(`Save error ${e.message}`)
    }
  }
  const [data, SetData] = React.useState({})
  React.useEffect(() => SetData(item), [item])

  const changed = (model) => {}

  const { goBack } = useHistory()

  const back = () => {
    goBack()
  }

  return (
    <Container>
      <Box my={7}>
        <Typography variant="h1">Registrations: {item.name}</Typography>
        <Typography color="primary" variant="h5">
          {item.type} (Revision {item.revision}: &nbsp;
          {moment(item.updatedAt).format('DD/MM/YY HH:mm')} )
        </Typography>
        <AutoForm
          schema={schemaBridge}
          model={item}
          onSubmit={save}
          autoField={CustomAutoField}
        />
        <Button type="button" onClick={back}>
          Cancel
        </Button>
      </Box>
    </Container>
  )
}

Add.propTypes = {
  loading: PropTypes.bool.isRequired,
  item: PropTypes.object.isRequired,
  methods: PropTypes.object.isRequired,
}
export default Add
