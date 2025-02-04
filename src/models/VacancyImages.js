// Пример модели Mongoose
import { Schema, model, models } from "mongoose";

const VacancyImagesShema = new Schema({

          name: String,
          data: Buffer,
          contentType: String
        
      
},{ timestamps: true });

const VacancyImages = models?.VacancyImages || model("VacancyImages", VacancyImagesShema);

export default VacancyImages;
