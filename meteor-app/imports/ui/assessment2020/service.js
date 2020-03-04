import React from 'react'
import SearchBar from './serviceItem-searchBar'
import ServiceItemTag from './serviceItem-tag'
import { ServiceContextProvider } from './service-context'

function Service() {
  return (
    <ServiceContextProvider>
      <SearchBar />
      <ServiceItemTag />
    </ServiceContextProvider>
  )
}

export default Service
