import React from 'react'
import PropTypes from 'prop-types'

import { AutoForm, AutoField, ErrorField } from 'uniforms-material'
import { Bridge, randomIds } from 'uniforms'

import FormNav from './form-nav'
import FieldsWrap from './fields-wrap'

const FIELD_COLS = 4
const rand = randomIds()

const Form = ({ onSubmit, model, schemaBridge }) => {
  // without key prop, uniforms doesn't re-render its context and the model in onSubmit() will be the previous form data
  return (
    <AutoForm
      schema={schemaBridge}
      onSubmit={onSubmit}
      model={model}
      key={rand()}
      modelTransform={
        (mode, model) => (mode === 'submit' ? schemaBridge.schema.clean(model) : model) // trim whitespace and remove key if empty string
      }
      placeholder
    >
      <FieldsWrap cols={FIELD_COLS}>
        {Object.keys(schemaBridge.schema.schema()).map((name, i) => {
          const fieldCols =
            schemaBridge.schema.schema(name)?.uniforms?.['ui:field-cols'] || FIELD_COLS
          return (
            <div key={i} style={{ gridColumnEnd: `span ${fieldCols}` }}>
              <AutoField name={name} />
              <ErrorField name={name} />
            </div>
          )
        })}
      </FieldsWrap>
      <FormNav />
    </AutoForm>
  )
}

Form.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  model: PropTypes.object.isRequired,
  schemaBridge: PropTypes.instanceOf(Bridge).isRequired,
}

export default Form
