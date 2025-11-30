import express from "express";
import { 
  createAppointment, 
  getAppointmentsForStudent, 
  checkPendingAppointment,
  cancelAppointment,
  approveAppointment,
  getAppointmentsForCounselor
} from "../controllers/appointmentController.js";
import { getAppointmentMessages } from "../controllers/messageController.js";
import Appointment from "../models/appointmentModel.js";

const router = express.Router();

// Student routes
router.post("/", createAppointment);
router.get("/student/:studentId", getAppointmentsForStudent);
router.get("/student/:studentId/pending", checkPendingAppointment);
router.put("/:appointmentId/cancel", cancelAppointment);

// Counselor routes
router.get("/counselor/:counselorId", getAppointmentsForCounselor);
router.put("/:appointmentId/approve", approveAppointment);

// Message routes for appointments
router.get("/:appointmentId/messages", getAppointmentMessages);

// GET /api/appointments/find?studentId=xxx&counselorId=yyy
router.get("/find/:studentId/:counselorId", async (req, res) => {
  const { studentId, counselorId } = req.params;

    const appointments = await Appointment.find({ student: studentId, counselor: counselorId });

  try {
    const appointment = await Appointment.findOne({
      student: studentId,
      counselor: counselorId,
      status: "confirmed" // or "scheduled"
    }).sort({ date: -1 });

    if (!appointment) {
      return res.status(404).json({ message: "No appointment found" });
    }

    res.json(appointment);
  } catch (err) {
    console.error("Error fetching appointment:", err);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/find/:appointmentId", async (req, res) => {
  const { appointmentId } = req.params;

  try {
    const appointment = await Appointment.findById(appointmentId);

    if (!appointment) {
      return res.status(404).json({ message: "No appointment found" });
    }

    res.json(appointment);
  } catch (err) {
    console.error("Error fetching appointment:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
