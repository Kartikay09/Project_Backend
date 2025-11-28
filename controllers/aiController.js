import AiLog from "../models/AiLog.js";

export const getAllAiLogs = async (req, res) => {
  try {
    const logs = await AiLog.find().sort({ timestamp: -1 });
    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addAiLog = async (req, res) => {
  try {
    const newLog = new AiLog(req.body);
    await newLog.save();
    res.status(201).json({ message: "AI Log added successfully", data: newLog });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
