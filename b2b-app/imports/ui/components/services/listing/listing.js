import React, { useCallback, useContext, useMemo, useState } from 'react'
import styled from 'styled-components'
import DataGrid, { Column, SortableHeaderCell } from 'react-data-grid'

import { Button, Typography } from '@material-ui/core'

import CONSTANTS from '/imports/api/constants.js'
import SearchBox from '/imports/ui/components/commons/search-box.js'
import { JobsListingContext } from './context'
import moment from 'moment'

const StyledJobsListing = styled.div`
  .filter-container {
    display: flex;
    flex-wrap: wrap;
    .filter-status-container {
      display: flex;
      flex-wrap: wrap;
    }
    .status-filter {
      padding: 5px 10px;
      margin: 3px 3px;
      .MuiButton-label {
        line-height: 1rem;
      }
      &.active {
        background-color: #007cfdde;
        color: #fff;
      }
    }
  }
  .grid-container {
    .job-grid {
      height: 500px;
    }
  }
  ${({ theme }) => `
    ${theme.breakpoints.down('xs')} {
      .filter-container {
        .search-box {
          width: 100%;
        }
        .filter-status-container {
          position: fixed;
          bottom: 0;
          left: 0;
          flex-wrap: nowrap;
          justify-content: space-between;
          width: 100%;
          .status-filter {
            padding: 5px 3px;
            margin: 3px 1px;
            min-width: unset;
          }
        }
      }
    }
  `}
`

function JobsListing() {
  const { loading, jobs, filterStatus, toggleFilterStatus, setFilterText } = useContext(
    JobsListingContext
  )

  const [sortColumns, setSortColumns] = useState([
    { columnKey: 'createdAt', direction: 'DESC' },
  ])

  const columns = [
    {
      key: 'createdAt',
      name: 'Created Date',
      formatter: ({ row }) => moment(row.createdAt).format('DD/MM/YYYY HH:mm'),
      width: 140,
      // frozen: true,
    },
    {
      key: 'bike',
      name: 'Bike',
      // width: 120,
      // frozen: true,
    },
    {
      key: 'customer',
      name: 'Customer',
      // width: 120,
      // frozen: true,
    },
    {
      key: 'cost',
      name: 'Cost',
      // width: 150,
      // frozen: true,
    },
    {
      key: 'status',
      name: 'Status',
      // width: 150,
      // frozen: true,
    },
  ]

  // TODO: change list of status
  const rows = useMemo(() => {
    return jobs.map((item) => {
      return {
        _id: item._id,
        createdAt: item.createdAt,
        bike: `${item.make} ${item.model}`,
        customer: item.name,
        cost: item.totalCost,
        status: CONSTANTS.JOB_STATUS_READABLE[item.status],
      }
    })
  }, [jobs])

  const rowKeyGetter = (row) => {
    return row._id
  }

  const getComparator = () => {
    // console.log(sortColumns)
    if (!sortColumns.length) {
      return () => 0
    }
    switch (sortColumns[0].columnKey) {
      case 'createdAt':
        return (a, b) => {
          return a.createdAt > b.createdAt ? 1 : -1
        }
      case 'bike':
        return (a, b) => {
          return a.bike.localeCompare(b.bike)
        }
      case 'customer':
        return (a, b) => {
          return a.customer?.localeCompare(b.customer)
        }
      case 'cost':
        return (a, b) => {
          console.log(a.cost > b.cost)
          return a.cost > b.cost ? 1 : -1
        }
      case 'status':
        return (a, b) => {
          return a.status.localeCompare(b.status)
        }
      default:
        return () => 0
    }
  }

  const sortedRows = useMemo(() => {
    if (sortColumns.length === 0) return rows

    const rowsTobeSorted = [...rows]
    rowsTobeSorted.sort((a, b) => {
      for (const sort of sortColumns) {
        const comparator = getComparator(sort.columnKey)
        const compResult = comparator(a, b)
        if (compResult !== 0) {
          return sort.direction === 'ASC' ? compResult : -compResult
        }
      }
      return 0
    })
    return rowsTobeSorted
  }, [rows, sortColumns])

  const renderFilterStatusBtn = ({ title, status }) => {
    const isActive = filterStatus.includes(status)
    const classNames = ['status-filter']
    if (isActive) {
      classNames.push('active')
    }
    return (
      <Button
        className={classNames.join(' ')}
        variant="contained"
        onClick={() => {
          toggleFilterStatus(status)
        }}
      >
        {title}
      </Button>
    )
  }

  return (
    <StyledJobsListing>
      <div className="filter-container">
        <SearchBox
          onChange={(searchQuery) => {
            setFilterText(searchQuery)
          }}
        />
        <div className="filter-status-container">
          {renderFilterStatusBtn({ title: 'New', status: 'new' })}
          {renderFilterStatusBtn({ title: 'In Progress', status: 'in-progress' })}
          {renderFilterStatusBtn({ title: 'Quality check', status: 'quality-check' })}
          {renderFilterStatusBtn({ title: 'Ready', status: 'ready' })}
          {renderFilterStatusBtn({ title: 'Archived', status: 'archived' })}
        </div>
      </div>
      <div className="grid-container">
        <DataGrid
          rowKeyGetter={rowKeyGetter}
          columns={columns}
          rows={sortedRows}
          defaultColumnOptions={{
            sortable: true,
            resizable: true,
          }}
          sortColumns={sortColumns}
          onSortColumnsChange={setSortColumns}
          className="job-grid"
        />
      </div>
    </StyledJobsListing>
  )
}

export default JobsListing
