import { Schema, model, models } from "mongoose";
import {VacancyOnServer} from './VacancyOnServer';
import {Candidate} from './Candidate';
import {Partner} from './Partner';
import {Role} from './Role';
const ManagerSchema = new Schema({
  vacancy: [{
    type: Schema.Types.ObjectId,
    ref: 'VacancyOnServer'
  }],
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
      }
});


const Manager = models?.Manager || model("Manager", ManagerSchema);
export default Manager;