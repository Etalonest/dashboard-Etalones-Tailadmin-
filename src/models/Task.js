import { Schema, model, models } from "mongoose";

const TaskSchema = new Schema({
  name: {
    type: String,
  },
  description: {
    type: String,
  },
  status: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  manager: {
    type: Schema.Types.ObjectId,
    ref: 'Manager',
  },
  partners: [{
    type: Schema.Types.ObjectId,
    ref: 'Partner'
  }],
  candidates: [{
    type: Schema.Types.ObjectId,
    ref: 'Candidate'
  }],
  comment: [{
    author: {
      type: String
    },
    text: {
      type: String
    },
    date: {
      type: Date,
      default: Date.now
    }
  }]});

const Task = models?.Task || model("Task", TaskSchema);
export default Task;