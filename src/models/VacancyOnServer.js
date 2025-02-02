import { Schema, model, models } from "mongoose";
import {VacancyImages} from './VacancyImages';
import {HomeImages} from './HomeImages';
const VacancyOnServerSchema = new Schema({
    image: {
        type: Schema.Types.ObjectId,
        ref: 'VacancyImages'
      },
    homeImages:[{
        type: Schema.Types.ObjectId,
        ref: 'HomeImages'
    }],
      title: {
        type: String
      },
      place: {
        type: Number
      },
      experience: {
        type: String
      },
      skills: {
        type: String
      },
      roof_type: {
        type: String
      },
      location: {
        type: String
      },
      auto: {
        type: String
      },
      positions_available: {
        type: String
      },
      salary: {
        type: String
      },
      homePrice: {
        type: String
      },
      home_descr: {
        type: String
      },
      work_descr: {
        type: String
      },
      grafik: {
        type: String
      },
      documents: [{
        type: String
      }],
      workHours: {
        type: String
      },
      getStart: {
        type: Date
      },
      published: {
        type: Boolean,
    
      },
      urgently: {
        type: Boolean,
      },
      last: {
        type: Boolean,
    
      },
      manager: {
        type: Schema.Types.ObjectId,
        ref: 'Manager'
      },
      category: {
        type: String
      }
});

const VacancyOnServer = models?.VacancyOnServer || model("VacancyOnServer", VacancyOnServerSchema);
export default VacancyOnServer;