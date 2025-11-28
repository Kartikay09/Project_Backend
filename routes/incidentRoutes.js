import express from "express";
import { getAllIncidents, addIncident, getIncidentById } from "../controllers/incidentController.js";

const router = express.Router();

router.get("/", getAllIncidents);
router.get("/:id", getIncidentById);
router.post("/", addIncident);

export default router;
