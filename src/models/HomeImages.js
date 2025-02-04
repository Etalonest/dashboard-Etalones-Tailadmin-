import { Schema, model, models } from "mongoose";

const HomeImagesShema = new Schema({

          name: String,
          data: Buffer,
          contentType: String
        
      
},{ timestamps: true });

const HomeImages = models?.HomeImages || model("HomeImages", HomeImagesShema);

export default HomeImages;
