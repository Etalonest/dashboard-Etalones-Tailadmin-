// Пример модели Mongoose
import { Schema, model, models } from "mongoose";

const DocumentShema = new Schema({
    
        file: {
          name: String,
          data: Buffer,
          contentType: String
        }
      
});

const Document = models?.Document || model("Document", DocumentShema);

export default Document;
