import mongoose from "mongoose";

const recoverySchema = new mongoose.Schema({
  incidentId: { type: mongoose.Schema.Types.ObjectId, ref: "Incident" },
  actionType: String,
  executedBy: String,
  status: String,
  executionTime: Number,
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("RecoveryAction", recoverySchema);
