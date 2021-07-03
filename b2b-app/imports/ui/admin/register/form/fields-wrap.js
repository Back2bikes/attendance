import React, { useContext } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import PropTypes from 'prop-types'

import { RegisterContext } from '../context'

const useStyles = makeStyles((theme) => ({
  root: {
    display: ({ isMobile }) => (isMobile ? 'block' : 'grid'),
    gridTemplateColumns: ({ cols }) => `repeat(${cols}, 1fr)`,
    columnGap: theme.spacing(2),
  },
}))

const FieldsWrap = ({ cols, children }) => {
  const { isMobile } = useContext(RegisterContext)
  const classes = useStyles({ cols, isMobile })
  return <div className={classes.root}>{children}</div>
}

FieldsWrap.propTypes = {
  children: PropTypes.node.isRequired,
  cols: PropTypes.number.isRequired,
}

export default FieldsWrap
