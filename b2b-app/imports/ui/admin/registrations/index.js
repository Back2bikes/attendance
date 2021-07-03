import React, { Suspense, lazy } from 'react'
import { Route, Switch } from 'react-router-dom'

import Loading from '/imports/ui/components/commons/loading.js'

const Lister = lazy(() => import('./lister.js'))
const Editor = lazy(() => import('./editor.js'))
const Viewer = lazy(() => import('./viewer.js'))
const Adder = lazy(() => import('./adder.js'))
const NotFound = lazy(() => import('/imports/ui/components/commons/not-found.js'))

export default function Registrations() {
  return (
    <Suspense fallback={<Loading loading />}>
      <Switch>
        <Route path="/admin/registrations/edit/:id" exact component={Editor} />
        <Route path="/admin/registrations/add/" exact component={Adder} />
        <Route path="/admin/registrations/view/:id" exact component={Viewer} />
        <Route path="/admin/registrations" exact component={Lister} />
        <Route component={NotFound} />
      </Switch>
    </Suspense>
  )
}
