import React, { Suspense, lazy } from 'react'
import { Route, Switch } from 'react-router-dom'

/**  Generated file DO NOT EDIT !!!
 * Generated by /Users/mikkel/easy/settler/scripts/generate-admin-files.js at 18-07-2021 20:07:10
 */
import Loading from '/imports/ui/components/commons/loading.js'

// Generated lazy imports go here...

const Audits = lazy(() => import('/imports/ui/admin/audits/lister.js'))
const Cronjobs = lazy(() => import('/imports/ui/admin/cronjobs/lister.js'))
const Triggers = lazy(() => import('/imports/ui/admin/triggers/lister.js'))
const MessageTemplates = lazy(() =>
  import('/imports/ui/admin/message-templates/lister.js')
)
const Members = lazy(() => import('/imports/ui/admin/members/lister.js'))
const Settings = lazy(() => import('/imports/ui/admin/settings/lister.js'))
const Surveys = lazy(() => import('/imports/ui/admin/surveys/lister.js'))
const Events = lazy(() => import('/imports/ui/admin/events/lister.js'))
const Courses = lazy(() => import('/imports/ui/admin/courses/lister.js'))
const Tools = lazy(() => import('/imports/ui/admin/tools/lister.js'))
const Sessions = lazy(() => import('/imports/ui/admin/sessions/lister.js'))
const ServiceItems = lazy(() => import('/imports/ui/admin/service-items/lister.js'))
const Jobs = lazy(() => import('/imports/ui/admin/jobs/lister.js'))
const Forms = lazy(() => import('/imports/ui/admin/forms'))

//
// This file contains a list of routes for database admin pages
// It is generated from a list of modules
//
export default GeneratedRoute = () => {
  return (
    <Suspense fallback={<Loading loading />}>
      <Switch>
        {/** Generated routes go here */}
        <Route path="/admin/audits" exact component={Audits} />
        <Route path="/admin/cronjobs" exact component={Cronjobs} />
        <Route path="/admin/triggers" exact component={Triggers} />
        <Route path="/admin/message-templates" exact component={MessageTemplates} />
        <Route path="/admin/members" exact component={Members} />
        <Route path="/admin/settings" exact component={Settings} />
        <Route path="/admin/surveys" exact component={Surveys} />
        <Route path="/admin/events" exact component={Events} />
        <Route path="/admin/courses" exact component={Courses} />
        <Route path="/admin/tools" exact component={Tools} />
        <Route path="/admin/sessions" exact component={Sessions} />
        <Route path="/admin/service-items" exact component={ServiceItems} />
        <Route path="/admin/jobs" exact component={Jobs} />
        <Route path="/admin/forms" component={Forms} />
      </Switch>
    </Suspense>
  )
}
