import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Form } from 'semantic-ui-react';

class AddVolunteer extends Component {

  handleSubmit = (event) => {
    event.preventDefault();
    console.log("handleSubmit method");
    this.props.onSubmit({
      firstname: this.firstname.value,
      surname: this.surname.value,
      pplPhone: this.pplPhone.value,
      pplEmail: this.pplEmail.value,
      avatar: Math.floor((Math.random() * 10) + 1) + '.jpg',
    });
  }

  // handleSubmit(event) {
  //   event.preventDefault();
  //   console.log("handlesSubmit method");
  //   this.props.onSubmit({
  //     newVolunteer: this.newVolunteer.value,
  //   });
  // }

  render() {
    return (
        <section id="volunteer-signup-form">
            <h1>New Volunteer Signup Form</h1>
            <h2>Your Details</h2>
            <form name="newVolunteer" onSubmit={this.handleSubmit} className="commentForm">
              <input ref={c => (this.firstname = c)} type="text" id="firstname" placeholder="First name" />

              <input ref={c => (this.surname = c)} type="text" id="surname" placeholder="Surname" />

              <input ref={c => (this.pplPhone = c)} type="text" id="pplPhone" placeholder="Phone" />

              <input ref={c => (this.pplEmail = c)} type="text" id="pplEmail" placeholder="Email" />

              <div className={"submit-cancel"} >

              <input className={"ui button"} type="submit" value="Submit" />
              <div className={"a-wrap"}><Link className={"ui button"} to="/">Cancel</Link></div>
              </div>
            </form>
        </section>
    );
  }
}

AddVolunteer.propTypes = {
  onSubmit: PropTypes.func.isRequired
};

export default AddVolunteer;
