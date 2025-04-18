import { Schema, model, models } from "mongoose";
import { Manager } from "@/src/models/Manager"
import { Candidate } from "@/src/models/Candidate"
import { Partner } from "@/src/models/Partner"
import { Vacancies } from "@/src/models/Vacancies"
const EventLogSchema = new Schema({
    eventType: {
        type: String,
      },
      relatedId:{
        type: Schema.Types.ObjectId,
        ref: 'Candidate',
      },
      responsible:{
        type: Schema.Types.ObjectId,
        ref: 'Manager',
      },
      appointed:{
        type: Schema.Types.ObjectId,
        ref: 'Manager',
      },
      partnerId:{
        type: Schema.Types.ObjectId,
        ref: 'Partner',
      },
    manager:{
        type: Schema.Types.ObjectId,
        ref: 'Manager',
    },
    description: {
        type: String,
        required: true,
      },
      vacancy:{
        type: Schema.Types.ObjectId,
        ref: 'Vacancies',
      },
      comment:{
        type: String,
      },
}, { timestamps: true });

const EventLog = models?.EventLog || model("EventLog", EventLogSchema)
export default EventLog;