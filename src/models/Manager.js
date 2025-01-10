import { Schema, model, models } from "mongoose";
import {Candidate} from './Candidate';
import {Partner} from './Partner';
import {Role} from './Role';
import { image } from "framer-motion/client";
const ManagerSchema = new Schema({
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