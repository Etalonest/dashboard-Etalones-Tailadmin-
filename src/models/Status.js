import mongoose from "mongoose";

const statusSchema = new mongoose.Schema({
    id: { type: String },
  name: { type: String, required: true },
});

const Status = mongoose.model("Status", statusSchema);

export default Status;
