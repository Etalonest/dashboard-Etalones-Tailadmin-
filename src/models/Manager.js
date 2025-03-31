import { Schema, model, models } from "mongoose";
import {Vacancies} from './Vacancies';
import {Candidate} from './Candidate';
import {Partner} from './Partner';
import {Role} from './Role';
import {EventLog} from './EventLog';
import {Task} from './Task';
const ManagerSchema = new Schema({
  vacancy: [{
    type: Schema.Types.ObjectId,
    ref: 'Vacancies'
  }],
  events:[
          {
            type: Schema.Types.ObjectId,
            ref: 'EventLog'
          }
        ],
      email: {
        type: String,
        unique: true,
      },
      image: {
        name: String,
        data: Buffer,
        contentType: String
      },
      name: {
        type: String,
      },
      phone: {
        type: String,
        unique: true,
      },
      telegram: {
        type: String
      },
      viber: {
        type: String
      },
      whatsapp: {
        type: String
      },
      candidates: [{
        type: Schema.Types.ObjectId,
        ref: 'Candidate'
      }],
      candidatesFromRecruiter: [{
        type: Schema.Types.ObjectId,
        ref: 'Candidate'
      }],
      candidateFromInterview: [{
        type: Schema.Types.ObjectId,
        ref: 'Candidate'
      }],
      candidateRejected: [{
        type: Schema.Types.ObjectId,
        ref: 'Candidate'
      }],
      candidateFromDA: [{
        type: Schema.Types.ObjectId,
        ref: 'Candidate'
      }],
      candidateFromObject: [{
        type: Schema.Types.ObjectId,
        ref: 'Candidate'
      }],
      partners: [{
        type: Schema.Types.ObjectId,
        ref: 'Partner'
      }],
      tasks: [{
        type: Schema.Types.ObjectId,
        ref: 'Task'
      }],
      onSite:{
        type: Boolean,
        default: false
      },
      role:{
        type: Schema.Types.ObjectId,
        ref: 'Role'
      },
      pushSubscription: { 
        endpoint: String,
        keys: {
          p256dh: String,
          auth: String
        }
      }
});


const Manager = models?.Manager || model("Manager", ManagerSchema);
export default Manager;