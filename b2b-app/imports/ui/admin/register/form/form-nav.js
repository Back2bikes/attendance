import React, { useContext } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Button, Fade, CircularProgress } from '@material-ui/core'
import { useForm } from 'uniforms'

import { RegisterContext } from '../context'

const useStyles = makeStyles((theme) => ({
  buttonGroup: {
    width: '100%',
  },
  formButtons: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  backButton: {
    marginRight: theme.spacing(2),
  },
  wrapper: {
    display: 'inline-block',
    position: 'relative',
  },
  progress: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginLeft: -12,
    marginTop: -12,
  },
}))

const FormNav = () => {
  const classes = useStyles()
  const uniforms = useForm()
  const { steps, isEditingStep, isSubmitting, activeStep, dispatch } = useContext(
    RegisterContext
  )

  let buttonText
  if (isEditingStep) {
    buttonText = 'Last'
  } else if (activeStep === steps.length - 1) {
    buttonText = 'Create account'
  } else {
    buttonText = 'Next'
  }

  return (
    <div className={classes.buttonGroup}>
      <div style={{ direction: 'rtl' }}>
        <div className={classes.wrapper}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            className={classes.formButtons}
            disabled={isSubmitting}
          >
            {buttonText}
          </Button>
          <Fade
            className={classes.progress}
            in={isSubmitting}
            style={{
              transitionDelay: isSubmitting ? '800ms' : '0ms',
            }}
            unmountOnExit
          >
            <CircularProgress size={24} />
          </Fade>
        </div>
        {!isEditingStep && activeStep > 0 && (
          <Button
            onClick={() => dispatch({ type: 'go_back', model: uniforms.model })}
            className={(classes.formButtons, classes.backButton)}
          >
            Back
          </Button>
        )}
      </div>
    </div>
  )
}

export default FormNav
