import React, { useEffect, Suspense, lazy } from 'react'
import styled from 'styled-components'
import { Route, Switch } from 'react-router-dom'
import { Helmet } from 'react-helmet'

import { Grid } from '@material-ui/core'

import Loading from '/imports/ui/components/commons/loading.js'

const SettingsList = lazy(() => import('/imports/ui/admin/settings/lister.js'))
const UserList = lazy(() => import('/imports/ui/admin/users/lister.js'))
const Cronjobs = lazy(() => import('/imports/ui/admin/cronjobs'))
const MessageTemplates = lazy(() => import('/imports/ui/admin/message-templates'))
const Triggers = lazy(() => import('/imports/ui/admin/triggers'))
const Surveys = lazy(() => import('/imports/ui/admin/surveys'))
const Events = lazy(() => import('/imports/ui/admin/events'))
const Courses = lazy(() => import('/imports/ui/admin/courses'))
const Tools = lazy(() => import('/imports/ui/admin/tools'))
const Sessions = lazy(() => import('/imports/ui/admin/sessions'))
const Register = lazy(() => import('/imports/ui/admin/register'))
const Registrations = lazy(() => import('/imports/ui/admin/registrations'))
const NotFoundComponent = lazy(() =>
  import('/imports/ui/components/commons/not-found.js')
)

const StyledAdminPage = styled.div``

function AdminPage() {
  useEffect(() => {
    // scroll to the top
    window.scrollTo({
      top: 0,
      behavior: 'auto',
    })
  }, [])

  return (
    <StyledAdminPage className="admin-page-container">
      {/* include moment.js here because react-tabulator needs it to handle datetime formater */}
      <Helmet>
        <script
          src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.29.1/moment.min.js"
          integrity="sha512-qTXRIMyZIFb8iQcfjXWCO8+M5Tbc38Qi5WzdPOYZHIlZpzBHG3L3by84BBBOiRGiEb7KKtAOAs5qYdUiZiQNNQ=="
          crossorigin="anonymous"
        ></script>
      </Helmet>
      <Grid container>
        <Grid item xs={12}>
          <Suspense fallback={<Loading loading />}>
            <Switch>
              <Route path="/admin/message-templates" component={MessageTemplates} />
              <Route path="/admin/settings" exact component={SettingsList} />
              <Route path="/admin/users" exact component={UserList} />
              <Route path="/admin/cronjobs" component={Cronjobs} />
              <Route path="/admin/triggers" component={Triggers} />
              <Route path="/admin/surveys" component={Surveys} />
              <Route path="/admin/events" component={Events} />
              <Route path="/admin/courses" component={Courses} />
              <Route path="/admin/tools" component={Tools} />
              <Route path="/admin/sessions" component={Sessions} />
              <Route path="/admin/register" component={Register} />
              <Route path="/admin/registrations" component={Registrations} />
              <Route component={NotFoundComponent} />
            </Switch>
          </Suspense>
        </Grid>
      </Grid>
    </StyledAdminPage>
  )
}

export default AdminPage
