import React, { useReducer, createContext } from 'react'
import PropTypes from 'prop-types'

import useMediaQuery from '@material-ui/core/useMediaQuery'
import { useTheme } from '@material-ui/core/styles'

const steps = ['Contact details', 'About you', 'Emergency contact', 'Avatar', 'Confirm']

const initialState = {
  models: Array(steps.length)
    .fill()
    .map(() => ({})),
  ui: {
    activeStep: 0,
    isEditingStep: false,
    isSubmitting: false,
  },
}

const reducer = (state, action) => {
  const {
    models,
    ui: { activeStep },
  } = state
  switch (action.type) {
    case 'go_next':
      return {
        models: models.map((model, i) => (i === activeStep ? action.model : model)),
        ui: { ...state.ui, activeStep: activeStep + 1 },
      }
    case 'go_back':
      return {
        models: models.map((model, i) => (i === activeStep ? action.model : model)),
        ui: { ...state.ui, activeStep: activeStep - 1 },
      }
    case 'go_last':
      return {
        models: models.map((model, i) => (i === activeStep ? action.model : model)),
        ui: { ...state.ui, isEditingStep: false, activeStep: models.length - 1 },
      }
    case 'go_submit':
      return {
        models: models.map((model, i) => (i === activeStep ? action.model : model)),
        ui: { ...state.ui, isSubmitting: true },
      }
    case 'go_edit_step':
      return {
        ...state,
        ui: { ...state.ui, isEditingStep: true, activeStep: action.step },
      }
    case 'submit_success':
      return {
        ...state,
        ui: {
          ...state.ui,
          isSubmitting: false,
          activeStep: models.length,
        },
      }
    case 'submit_fail':
      return {
        ...state,
        ui: {
          ...state.ui,
          isSubmitting: false,
        },
      }
    case 'go_reset':
      return initialState
    default:
      throw new Error('Invalid action type')
  }
}

const RegisterContext = createContext()

const RegisterProvider = ({ children }) => {
  const [{ models, ui }, dispatch] = useReducer(reducer, initialState)
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const { activeStep, isEditingStep, isSubmitting } = ui

  return (
    <RegisterContext.Provider
      value={{
        activeStep,
        models,
        isEditingStep,
        isSubmitting,
        steps,
        dispatch,
        isMobile,
      }}
    >
      {children}
    </RegisterContext.Provider>
  )
}

RegisterProvider.propTypes = {
  children: PropTypes.node.isRequired,
}

export { RegisterProvider as default, RegisterContext }
