import React from 'react'
import PropTypes from 'prop-types'
import SearchBar from './service-item-search'
import ServiceItemTag from './serviceItem-tag'
import { ServiceContextProvider } from './service-context'
import ServiceItemTagContainer from './serviceItem-tag-container'
import ServiceItemSearchContainer from './service-item-search-container'

import Summary from './summary-tab'
import FromTrail from './client'
import Client from './client'
import { Tab } from 'semantic-ui-react'

const panes = props => {
  let foundationPanes = [
    {
      menuItem: 'Service',
      render: () => (
        <Tab.Pane props={props}>
          <ServiceItemSearchContainer />
          <ServiceItemTagContainer />
        </Tab.Pane>
      )
    },
    {
      menuItem: 'Details',
      render: () => (
        <Tab.Pane props={props}>
          <Client />
        </Tab.Pane>
      )
    }
  ]

  if (props.job && props.logs && props.updateStatus && props.currentJob && props.members) {
    foundationPanes.push({
      menuItem: 'Summary',
      render: () => (
        <Tab.Pane>
          <Summary
            job={props.job}
            logs={props.logs}
            updateStatus={props.updateStatus}
            key={props.currentJob._id}
            currentJob={props.currentJob}
            members={props.members}
          />
        </Tab.Pane>
      )
    })
  }
  return foundationPanes
}

function Service(props) {
  return (
    <ServiceContextProvider {...props}>
      <Tab panes={panes(props)} />
    </ServiceContextProvider>
  )
}

Service.propTypes = {
  data: PropTypes.array.isRequired,
  tags: PropTypes.array.isRequired
}

export default Service
