import React from 'react'
import PropTypes from 'prop-types'

import { makeStyles, withStyles } from '@material-ui/core/styles'
import {
  Card,
  CardHeader,
  CardContent,
  IconButton,
  Table,
  TableBody,
  TableRow,
  TableCell as MuiTableCell,
} from '@material-ui/core'
import EditIcon from '@material-ui/icons/Edit'
import { Bridge } from 'uniforms'

const TableCell = withStyles({
  root: {
    borderBottom: 'none',
  },
})(MuiTableCell)

const useStyles = makeStyles((theme) => ({
  card: {
    marginBottom: theme.spacing(4),
  },
  fieldLabel: {
    fontWeight: 'bold',
  },
}))

const ConfirmData = ({ title, onEdit, schemaBridge, fieldValues }) => {
  const classes = useStyles()
  const fieldData = Object.entries(schemaBridge.schema.schema()).map(([field, data]) => {
    /* this checks if schema field uses a custom field component. Eg.
        avatar: {
            type: String,
            uniforms: AvatarField, // or uniforms: { component: AvatarField }
          }
        }
        For AvatarField, the field value is a src url so it's pointless to show it to the user.
        It's better to show the actual avatar, so we look for the custom field component to render
        something meaningful.
      */
    const CustomField = schemaBridge.getProps(field).component

    let value
    if (CustomField?.ConfirmDataView) {
      value = <CustomField.ConfirmDataView value={fieldValues[field]} />
    } else {
      value = fieldValues[field] ?? '-'
    }

    return {
      label: data.label,
      value,
    }
  })

  return (
    <Card className={classes.card}>
      <CardHeader
        title={title}
        action={
          <IconButton aria-label={'edit ' + title} onClick={onEdit}>
            <EditIcon />
          </IconButton>
        }
      />
      <CardContent>
        <Table>
          <TableBody>
            {fieldData.map(({ label, value }, i) => (
              <TableRow key={i}>
                <TableCell className={classes.fieldLabel}>{label}</TableCell>
                <TableCell>{typeof value === 'function' ? value() : value}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

ConfirmData.propTypes = {
  title: PropTypes.string.isRequired,
  onEdit: PropTypes.func.isRequired,
  schemaBridge: PropTypes.instanceOf(Bridge).isRequired,
  fieldValues: PropTypes.object.isRequired,
}

export default ConfirmData
