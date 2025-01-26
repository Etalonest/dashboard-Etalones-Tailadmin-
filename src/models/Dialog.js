import { Schema, model, models } from "mongoose";
import {Candidate} from './Candidate';
import {Partner} from './Partner';
import {User} from './User';

const DialogSchema = new Schema({
  text: {
    type: String,
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
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