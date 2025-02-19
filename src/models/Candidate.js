import { Schema, model, models } from "mongoose";
import {Document} from './Document';
import {Partner} from './Partner';
import {Task} from './Task';
import {Dialog} from './Dialog';
import {Stage} from './Stage';
import { type } from "os";
const CandidateSchema = new Schema({
  type: {
    type: String,
    default: 'candidate'
  },
  private: { 
    type: Boolean, 
    default: false 
  },
  stages: {
    type: Schema.Types.ObjectId,
    ref: 'Stage'
  },
  invitation:{
    checkbox: {
      type: Boolean,
      default: false
    },
    status:{
      type: String
    },
    manager:{
      type: Schema.Types.ObjectId,
      ref: 'Manager'
    },
    candidate:{
      type: Schema.Types.ObjectId,
      ref: 'Candidate'
    },
    date: {
      type: Date,
      default: Date.now
    },
    photoDocs:{
      type: String
    },
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
    }],
    paid: {
      type: Boolean,
      default: false
  }},
  dialogs: [{
    type: Schema.Types.ObjectId,
    ref: 'Dialog'
  }],
    avatar: {
        name: String,
        data: Buffer,
        contentType: String
      },
      documentsFile: [{
        type: Schema.Types.ObjectId,
        ref: 'Document'
      }],
      tasks: [{
        type: Schema.Types.ObjectId,
        ref: 'Task'
      }],
      source: {
        type: String
      },
      name: {
        type: String,
      },
      phone: {
        type: String,
        sparse: true,
        unique: true,
      },
      additionalPhones: [{
        type: String,
        unique: true,
      }],
      age: {
        type: Date,
      },
      ageNum: {
        type: String,
      },
      status: {
        type: String
      },
      partners: {
        type: Schema.Types.ObjectId,
        ref: 'Partner'
      },
      citizenship: {
        type: String,
      },
      // Переименовать в free
      leaving: {
        type: Date,
      },
      // дата приезда
      dateArrival: {
        type: Date,
      },
      drivePermis: [{
        type: String,
      }],
      cardNumber: {
        type: String,
      },
      workHours: {
        type: String,
      },
      locations: {
        type: String,
      },
      professions: [{
       name: String,
       expirience: String
      }],
      statusWork: [{
        name: String,
        date: Date
      }],
      documents: [{
        file: {
          type: Schema.Types.ObjectId,
          ref: 'Document'
        },
        docType: String,
        dateOfIssue: String,
        dateExp: String,
        numberDoc: String,
      }],
      langue: [{
        name: String,
        level: String,
      }],
      manager: {
        type: Schema.Types.ObjectId,
        ref: 'Manager',
        required: false
      },
      comment: [{
        author: {
          type: String
        },
        authorId:{
          type: Schema.Types.ObjectId,
          ref: 'Manager',
        },
        text: {
          type: String
        },
        date: {
          type: Date,
          default: Date.now
        }
      }],
      statusFromPartner: {
        status: String,
        who: String,
        from: String,
        to: String,
        dismissalDate: String
      },
      invoices: [{
        type: Schema.Types.ObjectId,
        ref: 'Invoices',
      }],
      interviews: [
        {
          type: Schema.Types.ObjectId, 
          ref: 'Interview'
        }
      ],
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
      }]
    },
      { timestamps: true })


const Candidate = models?.Candidate || model("Candidate", CandidateSchema);
export default Candidate;