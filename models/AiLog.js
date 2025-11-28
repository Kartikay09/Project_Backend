import mongoose from "mongoose";

const aiLogSchema = new mongoose.Schema({
  incidentId: { type: mongoose.Schema.Types.ObjectId, ref: "Incident" },
  aiConfidence: Number,
  threatCategory: String,
  decision: String,
  explanation: String,
  timestamp: { type: Date, default: Date.now }
});

export default mongoose.model("AiLog", aiLogSchema);
