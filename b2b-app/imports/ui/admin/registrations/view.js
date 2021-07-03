import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Paper from '@material-ui/core/Paper'
import config from './config'

const debug = require('debug')('se:edit')

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
})

const View = ({ item }) => {
  const classes = useStyles()

  return (
    <div>
      <Typography color="primary" variant="h5">
        Registrations: {item.name} (Revision {item.revision}: &nbsp;
        {moment(item.updatedAt).format('DD/MM/YY HH:mm')} )
      </Typography>
      <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="simple table">
          {config.view.header && (
            <TableHead>
              <TableRow>
                <TableCell>Item</TableCell>
                <TableCell>Value</TableCell>
              </TableRow>
            </TableHead>
          )}
          <TableBody>
            {config.view.rows.map((row, ix) => (
              <TableRow key={ix}>
                <TableCell component="th" scope="row" key="1">
                  {row.label || row.field}
                </TableCell>
                <TableCell key="2">{item[row.field]}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  )
}

View.propTypes = {
  item: PropTypes.object.isRequired,
}
export default View
