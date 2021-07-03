import React, { useContext } from 'react'
import PropTypes from 'prop-types'
import { useField } from 'uniforms'

import { makeStyles } from '@material-ui/core/styles'
import { Avatar, Card, CardContent, GridList, GridListTile } from '@material-ui/core'

import { RegisterContext } from '../context'
import ConditionalWrap from '../conditional-wrap'

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 345,
    margin: '0 auto',
  },
  selectedAvatar: {
    margin: theme.spacing(0, 'auto', 2, 'auto'),
    height: theme.spacing(16),
    width: theme.spacing(16),
    border: `3px solid ${theme.palette.grey['300']}`,
  },
  thumb: {
    margin: '5px auto',
  },
  selectedThumb: {
    boxShadow: `0 0 2px 4px ${theme.palette.primary.main}`,
  },
}))

const getSrc = (url) => {
  let realUrl = url
  const patt = /^http/
  if (!patt.test(url)) {
    realUrl = `/images/avatars/${url}`
  }
  return realUrl
}

const AvatarField = (rawProps) => {
  const classes = useStyles()
  const [{ value, onChange, allowedValues }] = useField('avatar', rawProps)
  const { isMobile } = useContext(RegisterContext)

  return (
    <ConditionalWrap
      condition={isMobile}
      wrapFalse={(children) => (
        <Card className={classes.root}>
          <CardContent>{children}</CardContent>
        </Card>
      )}
    >
      <Avatar src={getSrc(value)} alt={value} className={classes.selectedAvatar} />
      <GridList cols={isMobile ? 4 : 6} cellHeight="auto">
        {allowedValues.map((aValue, i) => (
          <GridListTile key={i} onClick={() => onChange(aValue)}>
            <Avatar
              src={getSrc(aValue)}
              alt={aValue}
              className={
                aValue === value
                  ? [classes.thumb, classes.selectedThumb].join(' ')
                  : classes.thumb
              }
            />
          </GridListTile>
        ))}
      </GridList>
    </ConditionalWrap>
  )
}

const useConfirmStyles = makeStyles((theme) => ({
  root: {
    height: theme.spacing(8),
    width: theme.spacing(8),
  },
}))

AvatarField.ConfirmDataView = ({ value }) => {
  const classes = useConfirmStyles()
  return <Avatar src={getSrc(value)} alt={value} className={classes.root} />
}

AvatarField.ConfirmDataView.displayName = 'AvatarField.ConfirmDataView'

AvatarField.ConfirmDataView.propTypes = {
  value: PropTypes.string.isRequired,
}

export default AvatarField
