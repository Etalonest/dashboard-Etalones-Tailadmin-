import { Schema, model, models } from "mongoose";
import {Candidate} from './Candidate';
import {User} from './User';
import {Partner} from './Partner';
import {Task} from './Task';
const StageSchema = new Schema({
  stage: {
    type: String,
  },
  status: {
    type: Date,
  },
  visa:{
    type: Boolean,
    document:{
        type: Schema.Types.ObjectId,
        ref: 'Document'
    }
  },
  passport:{
    type: Boolean,
    document:{
        type: Schema.Types.ObjectId,
        ref: 'Document'
    }
  },
  candidate: {
    type: Schema.Types.ObjectId,
    ref: 'Candidate',
  },
  responsible: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
}, { timestamps: true });

const Stage = models?.Stage || model("Stage", StageSchema);
export default Stage;