import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  passwordHash: String,
  role: String,
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("User", userSchema);
