import React from 'react'

import { makeStyles } from '@material-ui/core/styles'
import {
  Container,
  Stepper,
  Step,
  StepLabel,
  Button,
  Typography,
} from '@material-ui/core'

import RegisterProvider, { RegisterContext } from './context'
import StepBody from './step-body'

const useStyles = makeStyles({
  title: {
    textAlign: 'center',
    padding: '1em',
  },
})

const Register = () => {
  const classes = useStyles()

  return (
    <RegisterProvider>
      <Container maxWidth="lg">
        <Typography variant="h1" className={classes.title}>
          Registration
        </Typography>
        <RegisterContext.Consumer>
          {({ activeStep, steps, dispatch, isMobile }) => (
            <>
              <Stepper
                activeStep={activeStep}
                alternativeLabel={!isMobile}
                orientation={isMobile ? 'vertical' : 'horizontal'}
              >
                {steps.map((label, i) => (
                  <Step key={label}>
                    <StepLabel>{label}</StepLabel>
                    {isMobile && activeStep === i && <StepBody />}
                  </Step>
                ))}
              </Stepper>
              <div>
                {activeStep === steps.length && (
                  <div>
                    <h1>Registration Complete</h1>

                    <br />
                    <Button onClick={() => dispatch({ type: 'go_reset' })}>Reset</Button>
                  </div>
                )}
                {!isMobile && activeStep in steps && <StepBody />}
              </div>
            </>
          )}
        </RegisterContext.Consumer>
      </Container>
    </RegisterProvider>
  )
}

export default Register
