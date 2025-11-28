import express from "express";
import { getAllAiLogs, addAiLog } from "../controllers/aiController.js";

const router = express.Router();

router.get("/", getAllAiLogs);
router.post("/", addAiLog);

export default router;
