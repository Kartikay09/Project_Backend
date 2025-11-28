import express from "express";
import { getAllRecoveryActions, addRecoveryAction } from "../controllers/recoveryController.js";

const router = express.Router();

router.get("/", getAllRecoveryActions);
router.post("/", addRecoveryAction);

export default router;
