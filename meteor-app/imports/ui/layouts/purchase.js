import React from 'react'
import { Switch, Route } from 'react-router-dom'
import NotFound from '/imports/ui/not-found'
import Purchase from '/imports/ui/purchase/purchase-option-card'
import '/imports/ui/layouts/attendance.css'
import Nav from '/imports/ui/member/member-nav'

const PurchaseLayout = () => (
  <div className="Purchase-wrapper">
    <title>Back 2 Bikes | Purchase Sessions</title>
    <Nav />
        <div style={{ height: '100%' }}>
          <Switch>
            <Route path="/" component={Purchase} />
            <Route component={NotFound} />
          </Switch>
        </div>
  </div>
)

export default PurchaseLayout