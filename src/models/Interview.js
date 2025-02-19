import { Schema, model, models } from "mongoose";
import {Vacancies} from './Vacancies';
import {Manager} from './Manager';

const InterviewSchema = new Schema({
  status: {
    type: String,
    default: 'отправил'
  },
  vacancy: {
    type: Schema.Types.ObjectId,
    ref: 'Vacancies'
  },
  manager: {
    type: Schema.Types.ObjectId,
    ref: 'Manager'
  },
  date: {
    type: Date,
    default: Date.now
  },
  comment: {
    type: String
  },
},
{ timestamps: true });

const Interview = models?.Interview || model("Interview", InterviewSchema);
export default Interview;