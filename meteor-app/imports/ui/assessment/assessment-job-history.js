import React from 'react'
import { Meteor } from 'meteor/meteor'
import { Component } from 'react';
import { Grid, Search, Button } from 'semantic-ui-react'
import JobCard from '/imports/ui/assessment/assessment-job-card'
import Nav from '/imports/ui/ordering/navbar'
import { withTracker } from "meteor/react-meteor-data";
import Assessment from '/imports/api/assessments/assessment'
import Members from '/imports/api/members/members'
import { JOB_STATUS_READABLE } from '/imports/api/constants'
import './assessment-job-card-list.css'

const searchVar = new ReactiveVar('')
const statusVar = new ReactiveVar('')

class JobHistory extends Component {
  state = {
    active: null,
    showAll: true,
  }

  setButtonState = (status) => {
    if(status === 'all'){
      this.setState({
        showAll: true,
        active: null
      });
      this.props.statusFilter(status)
    } else {
      this.setState({
        active: status.key,
        showAll: false,
      });
      this.props.statusFilter(status)
    }
  }

  componentWillUnmount() {
      this.props.resetStatus()
  }

  // all props being passed to JobCard need to be changed to the actual data from the db
  render() {
    const statusOptions = Object.keys(JOB_STATUS_READABLE)
    .filter(key => key >= "4")
    .map(key => {
      return {
        key: key,
        value: JOB_STATUS_READABLE[key],
        text: JOB_STATUS_READABLE[key]
      } 
    })

    return (
      <>
        <Nav />
        <Grid stackable>
          <Grid.Row columns={2}>
            <Grid.Column>
              <div style={{marginLeft: "50px", marginTop: "20px"}}>
                <Button.Group basic id="button-parent">
                  <Button
                      toggle
                      className={this.state.showAll ? 'active' : ''}            
                      value='all'
                      onClick={() => this.setButtonState('all')}
                    >
                    Show All
                  </Button>
                  {statusOptions
                  .map((status) => 
                    <Button
                      toggle
                      className={this.state.active === status.key ? 'active' : ''}            
                      key={status.key}
                      value={status.value}
                      onClick={() => this.setButtonState(status)}
                    >
                    {status.text}
                    </Button>
                  )}
                  <Button
                      onClick={() => {
                        this.props.history.push("/jobs");
                      }}
                    >
                      Current Jobs
                  </Button>
                </Button.Group>
              </div>
            </Grid.Column>

            <Grid.Column>
              <div style={{textAlign: "right", marginRight: "50px", marginTop: "20px"}}>
                <Search
                  open={false}
                  fluid
                  onSearchChange={this.props.searchFind}
                  type='text'
                  size='large'
                  placeholder='Enter bike make/color or customer name'/>
              </div>
            </Grid.Column>
          </Grid.Row>
        </Grid>

        <Grid style={{marginLeft: "50px", marginRight: "50px" }}>
          {this.props.jobs
          .filter(job => job.status >= "4")
          .map(job =>
            <Grid.Row key={job._id}>
              <JobCard
                currentJob={job}
                updateStatus={this.props.updateStatus}
                members={this.props.members}
              />
            </Grid.Row>
          )}
        </Grid>
      </>
    )
  }
}

export default withTracker(props => {
  Meteor.subscribe('assessments.all')
  Meteor.subscribe('all.members')

  const searchLine = searchVar.get()
  const statusLine = statusVar.get()
  
  const searchFind = event => {
    const value = event.target.value
    resetStatus()
    searchVar.set(value)
  }

  const statusFilter = (status) => {
      statusValue = Object.keys(JOB_STATUS_READABLE) // [ "1","2","3","4","5" ]
        .filter(key => key === status.key) // ["1"]
        .map(value => parseInt(value)) // [1]
  statusVar.set(statusValue)
  }

  const resetStatus = () => {
    statusVar.set([3,4])
  }

  const updateStatus = (jobId, updatedStatus) => {
    Meteor.call('assessment.updateJobStatus', jobId, updatedStatus)
  }

  const renderJob = () => {
    if (statusLine == '') {
      return Assessment.find({ search: { $regex: searchLine.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), $options: "i" } }).fetch()
    }
    return Assessment.find({ search: { $regex: searchLine.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), $options: "i"  }, status: { $in: statusLine } }).fetch()
  }

  return {
    jobs: renderJob(),
    members: Members.find().fetch(),
    searchFind,
    statusFilter,
    updateStatus,
    resetStatus
  }
})(JobHistory)