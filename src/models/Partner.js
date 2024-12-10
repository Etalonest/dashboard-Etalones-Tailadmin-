import { Schema, model, models } from "mongoose";

const PartnerSchema = new Schema({
 
    professions: [{
        name: {
          type: String,
        },
        experience: { 
          type: String 
        },
        place:{
          type: Number
        },
        salary:{
          type: String
        },
        skills:{
          type: String
        },
        langue: {
          name: String,
          level: String,
        },
        avans: {
          type: String
        },
        getStart:{
          type: Boolean
        },
        rentPrice:{
          type: String
        },
        workHours:{
          type: Number
        },
        candidates: [{
          type: Schema.Types.ObjectId,
          ref: 'Candidate'
        }],
        interview: [
          {
            type: Schema.Types.ObjectId, ref: 'Interview'
          }
        ]
      }],
      name: {
        type: String,
      },
      phone: {
        type: String,
      },
      email: {
        type: String,
      },
      site: {
        type: String
      },
      companyName: {
        type: String,
      },
    // Рабочая одежда
      workwear: {
        desc:{
          type: String
        },
        stat:{
          type: Boolean
        }
      },
      numberDE: {
        type: String,
      },
      location: {
        type: String,
      },
      manager: {
        type: Schema.Types.ObjectId,
        ref: 'Manager'
      },
      candidates: [{
        type: Schema.Types.ObjectId,
        ref: 'Candidate'
      }],
      contract: {
        typeC: String,
        sum: String,
        salaryWorker: String,
      },
      documents: [{
        docType: String,
        dateOfIssue: String,
        dateExp: String,
        numberDoc: String,
      }],
      status: {
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
      documentsFile: [{
        type: Schema.Types.ObjectId,
        ref: 'Document'
      }]
    },
      { timestamps: true });

const Partner = models?.Partner || model("Partner", PartnerSchema);
export default Partner;