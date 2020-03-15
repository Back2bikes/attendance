import React from 'react'
import { Route } from 'react-router-dom'
// Generated code to import all of the DB UI components
import EventsList from '/imports/ui/events/lister'
import PromosList from '/imports/ui/promos/lister'
import ProductsList from '/imports/ui/products/lister'
import SessionsList from '/imports/ui/sessions/lister'
import PartsList from '/imports/ui/parts/lister'

//
// This file contains a list of routes for database admin pages
// It is generated from a list of modules
//
export default GeneratedRoute = () => (
  <>
    <Route path="/admin/events" component={EventsList} />
<Route path="/admin/promos" component={PromosList} />
<Route path="/admin/products" component={ProductsList} />
<Route path="/admin/sessions" component={SessionsList} />
<Route path="/admin/parts" component={PartsList} />
  </>
)
