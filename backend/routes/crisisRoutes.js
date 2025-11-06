import express from "express";
import { createCrisisAlert, listCrisisAlerts, updateCrisisStatus, getCrisisAnalytics } from "../controllers/crisisController.js";

const router = express.Router();

router.post("/", createCrisisAlert);
router.get("/", listCrisisAlerts);
router.get("/analytics", getCrisisAnalytics);
router.patch("/:id/status", updateCrisisStatus);

export default router;


