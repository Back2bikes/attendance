import { Meteor } from 'meteor/meteor'
import Registrations from '../schema'
import '../methods'
/* Commented out related publications (if any) - best to add these in manually as required
 
*/

Meteor.publish('all.registrations', () => {
  return Registrations.find({})
})

Meteor.publish('id.registrations', (id) => {
  return [
    Registrations.find(id),
    /* Commented out related publications (if any) - best to add these in manually as required
     
    */
  ]
})
