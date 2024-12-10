import { Schema, model, models } from "mongoose";

const CandidateSchema = new Schema({
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
       experience: String
      }],
      documents: [{
        docType: String,
        dateOfIssue: String,
        dateExp: String,
        numberDoc: String,
      }],
      langue: {
        name: String,
        level: String,
      },
      manager: {
        type: Schema.Types.ObjectId,
        ref: 'Manager',
        required: false
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
          type: Schema.Types.ObjectId, ref: 'Interview'
        }
      ]
    },
      { timestamps: true })


const Candidate = models?.Candidate || model("Candidate", CandidateSchema);
export default Candidate;