// Пример модели Mongoose
import mongoose from "mongoose";

const documentShema = new mongoose.Schema({
    
        file: {
          name: String,
          data: Buffer,
          contentType: String
        }
      
});

const Document = mongoose.model("Status", documentShema);

export default Document;
