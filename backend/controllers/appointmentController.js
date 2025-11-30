import Appointment from "../models/appointmentModel.js";
import mongoose from "mongoose";
import { v4 as uuidv4 } from 'uuid';

export const createAppointment = async (req, res) => {
  try {
    const appointmentData = { ...req.body };

    // Validate that student ID is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(appointmentData.student)) {
      return res.status(400).json({
        error: 'Invalid student ID. Please ensure you are logged in properly.'
      });
    }

    const appointment = new Appointment(appointmentData);
    await appointment.save();

    res.status(201).json(appointment);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getAppointmentsForStudent = async (req, res) => {
  try {
    const { studentId } = req.params;

    // For demo purposes, if studentId is not a valid ObjectId, return empty array
    if (!mongoose.Types.ObjectId.isValid(studentId)) {
      return res.json([]);
    }

    const appointments = await Appointment.find({ student: studentId })
      .populate('counselor', 'name specialization')
      .sort({ date: -1, timeSlot: 1 });

    res.json(appointments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const checkPendingAppointment = async (req, res) => {
  try {
    const { studentId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(studentId)) {
      return res.json(null);
    }

    const pendingAppointment = await Appointment.findOne({
      student: studentId,
      status: 'pending'
    }).populate('counselor', 'name specialization');

    res.json(pendingAppointment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const cancelAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const { studentId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(appointmentId)) {
      return res.status(400).json({ error: 'Invalid appointment ID' });
    }

    const appointment = await Appointment.findOneAndUpdate(
      { _id: appointmentId, student: studentId },
      {
        status: 'cancelled',
        cancelledAt: new Date()
      },
      { new: true }
    ).populate('counselor', 'name specialization');

    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    // Log the cancellation
    try {
      await ActivityLog.create({
        user: studentId,
        action: "appointment_cancel",
        metadata: {
          appointmentId: appointment._id,
          counselor: appointment.counselor._id,
          date: appointment.date,
          timeSlot: appointment.timeSlot
        }
      });
    } catch (error) {
    }

    res.json(appointment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const approveAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const { counselorId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(appointmentId)) {
      return res.status(400).json({ error: 'Invalid appointment ID' });
    }

    const appointment = await Appointment.findOneAndUpdate(
      { _id: appointmentId, counselor: counselorId, status: 'pending' },
      {
        status: 'confirmed',
        confirmedAt: new Date(),
        roomId: `room-${appointmentId}-${uuidv4()}`
      },
      { new: true }
    ).populate('student', 'firstName lastName email')
      .populate('counselor', 'name specialization');

    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found or already processed' });
    }

    // Log the approval
    try {
      await ActivityLog.create({
        user: counselorId,
        action: "appointment_approve",
        metadata: {
          appointmentId: appointment._id,
          student: appointment.student._id,
          date: appointment.date,
          timeSlot: appointment.timeSlot
        }
      });
    } catch (error) {
      }

    res.json(appointment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAppointmentsForCounselor = async (req, res) => {
  try {
    const { counselorId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(counselorId)) {
      return res.status(400).json({ error: 'Invalid counselor ID' });
    }

    const appointments = await Appointment.find({ counselor: counselorId })
      .populate('student', 'firstName lastName email profileImage')
      .sort({ date: -1, timeSlot: 1 });

    res.json(appointments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



