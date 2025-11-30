import mongoose from "mongoose";
import fs from "fs";
import Appointment from "../models/appointmentModel.js"; // adjust your model path
import crisisAlertModel from "../models/crisisAlertModel.js";
import { Assessment } from "../models/assessmentModel.js";
import path from "path";
import dotenv from "dotenv";

dotenv.config({ path: "../.env" });

const MONGO_URI = process.env.MONGO_URI;
// connect to mongo
await mongoose.connect(MONGO_URI);

try {
    await Appointment.deleteMany({});
    await crisisAlertModel.deleteMany({});
    await Assessment.deleteMany({});
    // Read JSON file
    const appointments = JSON.parse(fs.readFileSync("../jsonFiles/appointments_sample.json", "utf-8"));
    const crisisAlerts = JSON.parse(fs.readFileSync("../jsonFiles/crisis_alerts.json", "utf-8"));
    const assessments = JSON.parse(fs.readFileSync("../jsonFiles/synthetic_mental_health_data.json", "utf-8"));
    // Insert into DB
    const result = await Appointment.insertMany(appointments);

    const crisisResult = await crisisAlertModel.insertMany(crisisAlerts);

    const assessmentResult = await Assessment.insertMany(assessments);


} catch (err) {
    console.error("Error inserting appointments:", err);
}

mongoose.connection.close();

