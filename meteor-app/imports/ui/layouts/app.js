import React from 'react'
import PropTypes from 'prop-types'
import { Meteor } from 'meteor/meteor'
import { withTracker } from 'meteor/react-meteor-data'
import 'semantic-ui-css/semantic.css'
import { Roles } from 'meteor/alanning:roles'
import isIframe from '/imports/helpers/isIframe'
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom'

import NavBar from '../components/nav-bar'
import './app.css'

import Shop from '/imports/ui/shop'
import Ordering from '/imports/ui/layouts/ordering'
import PayNow from '../pages/pay-now'
import Assessment from '/imports/ui/assessment/assessment'
import JobCardLister from '/imports/ui/assessment/assessment-job-card-lister'
import JobHistory from '/imports/ui/assessment/assessment-job-history'
import MemberAddContainer from '/imports/ui/member/member-add-container'
import MemberMainContainer from '/imports/ui/member-main-container'
import MemberEdit from '/imports/ui/member-edit'
import Visit from '/imports/ui/visit'

// These ones were created when initially setting up the new menu system,
// and can probably go at some stage
import NotFound from '../pages/not-found'
import Login from '../pages/login'
import Signup from '../pages/signup'
import Signout from '../pages/logout'
import Admin from '../pages/admin-routes'
import SuperAdmin from '../pages/super-admin'

const Home = props => <div>Home is where the heart is (app.js)</div>

/** Top-level layout component for this application. Called in imports/startup/client/startup. */
const App = props => {
  if (!Roles.subscription.ready()) return <div>NOT READY</div>
  const isLogged = Meteor.userId() !== null
  const showSide =
    (!isIframe() &&
      !(location.pathname.match(/kiosk/) || location.pathname.match(/shop/) || location.pathname.match(/visit/))) ||
    isLogged
  const containerId = showSide ? 'app-container' : 'iframe-container'
  return (
    <div id={containerId}>
      {showSide && (
        <div id="sidebar-container">
          <NavBar />
        </div>
      )}
      {!showSide && <div id="sidebar-none"></div>}
      <div>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/signup" component={Signup} />
          <Route path="/login" component={Login} />
          <Route path="/shop" component={Shop} />
          <Route path="/kiosk" component={MemberMainContainer} />
          <Route path="/visit/:id" component={Visit} />
          <Route path="/add" component={MemberAddContainer} />

          <SecureRoute role="signin" path="/volsignin" component={MemberMainContainer} />
          <SecureRoute role="signin" path="/edit/:id" component={MemberEdit} />

          <SecureRoute role="parts" path="/parts" component={Ordering} />

          <SecureRoute role="servicing" path="/assessment" component={Assessment} />
          <SecureRoute role="servicing" path="/jobs" component={JobCardLister} />
          <SecureRoute role="servicing" path="/job-history" component={JobHistory} />

          <SecureRoute role="paynow" path="/paynow" component={PayNow} />

          {/* <AdminProtectedRoute path="/admin" component={Admin} /> */}
          <SecureRoute role="admin" path="/admin" component={Admin} />

          <SecureRoute role="superadmin" path="/superadmin" component={SuperAdmin} />

          <SecureRoute path="/signout" component={Signout} />
          <Route component={NotFound} />
        </Switch>
      </div>
    </div>
  )
}

const GotoLogin = props => <Redirect to={{ pathname: '/login', state: { from: props.location } }} />

/**
 * SecureRoute (see React Router v4 sample)
 * Checks for Meteor login and admin role before routing to the requested page, otherwise goes to login page.
 * @param {any} { component: Component, ...rest }
 */
const SecureRoute = ({ role, component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props => {
      const isLogged = Meteor.userId() !== null
      const hasRights = role ? Roles.userIsInRole(Meteor.userId(), role) : true
      return isLogged && hasRights ? <Component {...props} /> : <GotoLogin {...props} />
    }}
  />
)

/** Require a component and location to be passed to each SecureRoute. */
SecureRoute.propTypes = {
  component: PropTypes.func.isRequired,
  location: PropTypes.object
}

//
// Add in a withTracker component, so that we end up waiting for the roles to be loaded before we render menus
//
const AppLoader = props => {
  if (props.loading) return <div>Loading...</div>
  return (
    <Router>
      <App {...props} />
    </Router>
  )
}

export default withTracker(props => {
  return {
    loading: !Roles.subscription.ready()
  }
})(AppLoader)