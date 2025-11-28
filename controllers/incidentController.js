import Incident from "../models/Incident.js";
import AiLog from "../models/AiLog.js";
import RecoveryAction from "../models/RecoveryAction.js";

export const getAllIncidents = async (req, res) => {
  try {
    const incidents = await Incident.find().sort({ detectedAt: -1 });
    res.json(incidents);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getIncidentById = async (req, res) => {
  try {
    const incident = await Incident.findById(req.params.id);
    const aiLogs = await AiLog.find({ incidentId: req.params.id });
    const recoveryActions = await RecoveryAction.find({ incidentId: req.params.id });

    if (!incident) return res.status(404).json({ message: "Incident not found" });

    res.json({ incident, aiLogs, recoveryActions });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addIncident = async (req, res) => {
  try {
    const newIncident = new Incident(req.body);
    await newIncident.save();
    res.status(201).json({ message: "Incident added successfully", data: newIncident });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
