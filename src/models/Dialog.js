import { Schema, model, models } from "mongoose";
import {Candidate} from './Candidate';
import {Partner} from './Partner';
import {Manager} from './Manager';
import {User} from './User';

const DialogSchema = new Schema({
  text: {
    type: String,
  },
  author: {
    type: String
  },
  date: {
    type: Date,
    default: Date.now
  },
  candidate: {
    type: Schema.Types.ObjectId,
    ref: 'Candidate',
  },
  partner: {
    type: Schema.Types.ObjectId,
    ref: 'Partner',
  },
});

const Dialog = models?.Dialog || model("Dialog", DialogSchema);
export default Dialog;