import mongoose from "mongoose";

const incidentSchema = new mongoose.Schema({
  threatType: String,
  sourceIP: String,
  severity: String,
  description: String,
  status: String,
  detectedBy: String,
  detectedAt: { type: Date, default: Date.now }
});

export default mongoose.model("Incident", incidentSchema);
