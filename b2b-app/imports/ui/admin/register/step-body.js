import React, { useContext, useEffect } from 'react'
import { Typography, Paper } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import StepContent from '@material-ui/core/StepContent'

import { meteorCall } from '/imports/ui/utils/meteor'
import { RegisterContext } from './context'
import Form from './form'
import {
  termsFormBridge,
  contactFormBridge,
  emergencyFormBridge,
  aboutFormBridge,
  avatarFormBridge,
} from './form/form-schemas'
import ConfirmData from './form/confirm-data'
import ConditionalWrap from './conditional-wrap'

const useStyles = makeStyles((theme) => ({
  formHeading: {
    marginBottom: theme.spacing(2),
    textAlign: 'center',
  },
  paper: {
    margin: theme.spacing(4, 0),
    padding: theme.spacing(4, 2),
  },
  formWrap: {
    maxWidth: 600,
    margin: '0 auto',
  },
  frontMatter: {
    marginBottom: theme.spacing(4),
  },
}))

const schemaBridges = [
  contactFormBridge,
  aboutFormBridge,
  emergencyFormBridge,
  avatarFormBridge,
  termsFormBridge,
]

function getStepHeading(stepIndex) {
  switch (stepIndex) {
    case 0:
      return "Let's start with some basic contact details"
    case 1:
      return "Let's learn a bit about you"
    case 2:
      return 'Who should we contact in an emergency?'
    case 3:
      return 'Choose your avatar'
    case 4:
      return "Just making sure everything's correct"
    default:
      return 'Unknown stepIndex'
  }
}

const StepBody = (props) => {
  const classes = useStyles()
  const {
    steps,
    activeStep,
    models,
    isEditingStep,
    isSubmitting,
    dispatch,
    isMobile,
  } = useContext(RegisterContext)

  useEffect(() => {
    const submitData = async () => {
      if (!isSubmitting) return
      console.log('sending to server')

      const s = await meteorCall(
        'insert.registrations',
        'saving',
        Object.assign({}, ...models)
      )

      if (s?.status === 'success') {
        dispatch({ type: 'submit_success' })
      } else if (s?.status === 'failure') {
        dispatch({ type: 'submit_fail' })
      }
    }
    submitData()
  }, [isSubmitting])

  const getFrontMatter = (step) => {
    if (step === steps.length - 1) {
      return steps
        .slice(0, -1)
        .map((title, i) => (
          <ConfirmData
            key={i}
            title={title}
            onEdit={() => dispatch({ type: 'go_edit_step', step: i })}
            schemaBridge={schemaBridges[i]}
            fieldValues={models[i]}
          />
        ))
    }
  }

  const getForm = (index) => {
    const handleSubmit = (model) => {
      if (isEditingStep) {
        dispatch({ type: 'go_last', model })
      } else if (activeStep === steps.length - 1) {
        dispatch({ type: 'go_submit', model })
      } else if (activeStep in steps) {
        dispatch({ type: 'go_next', model })
      }
    }

    return (
      <Form
        onSubmit={handleSubmit}
        model={models[index]}
        schemaBridge={schemaBridges[index]}
      />
    )
  }

  if (!(activeStep in steps)) {
    return null
  }

  return (
    <ConditionalWrap
      condition={isMobile}
      wrapTrue={(children) => <StepContent {...props}>{children}</StepContent>}
      wrapFalse={(children) => (
        <Paper variant="outlined" className={classes.paper} square>
          {children}
        </Paper>
      )}
    >
      <Typography variant="h2" className={classes.formHeading}>
        {getStepHeading(activeStep)}
      </Typography>
      <div className={classes.formWrap}>
        <div className={classes.frontMatter}>{getFrontMatter(activeStep)}</div>
        {getForm(activeStep)}
      </div>
    </ConditionalWrap>
  )
}

export default StepBody
