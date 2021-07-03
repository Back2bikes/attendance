import React from 'react'
import { useHistory } from 'react-router-dom'
import PropTypes from 'prop-types'
import Button from '@material-ui/core/Button'
import { AutoForm } from 'uniforms-material'
import { CustomAutoField } from '/imports/ui/components/forms'
import config from './config'

const schemaBridge = config.edit.schema

const debug = require('debug')('se:edit')

const Edit = ({ id, item, methods }) => {
  const save = (model) => {
    try {
      methods.update(id, model)
    } catch (e) {
      alert(`Update error ${e.message}`)
    }
  }

  const { goBack } = useHistory()
  const back = () => {
    goBack()
  }

  const [data, SetData] = React.useState({})

  React.useEffect(() => SetData(item), [item])

  return (
    <div>
      <div>Edit Registrations - {data.name}</div>
      <AutoForm
        schema={schemaBridge}
        model={item}
        onSubmit={save}
        autoField={CustomAutoField}
      />
      <Button type="button" onClick={back}>
        Cancel
      </Button>
      &nbsp;&nbsp;
    </div>
  )
}

Edit.propTypes = {
  id: PropTypes.string.isRequired,
  loading: PropTypes.bool.isRequired,
  item: PropTypes.object.isRequired,
  methods: PropTypes.object.isRequired,
}
export default Edit
