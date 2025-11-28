import RecoveryAction from "../models/RecoveryAction.js";

export const getAllRecoveryActions = async (req, res) => {
  try {
    const actions = await RecoveryAction.find().sort({ createdAt: -1 });
    res.json(actions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addRecoveryAction = async (req, res) => {
  try {
    const newAction = new RecoveryAction(req.body);
    await newAction.save();
    res.status(201).json({ message: "Recovery Action added successfully", data: newAction });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
