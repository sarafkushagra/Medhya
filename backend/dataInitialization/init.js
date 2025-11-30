
// init.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import { faker } from "@faker-js/faker";

// Import Models
import User from "../models/usermodel.js"

dotenv.config({ path: "../.env" });

const MONGO_URI = process.env.MONGO_URI; // change DB name if needed

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);

    // Clear old data
    await Promise.all([
      User.deleteMany()
    ]);


    // ---------------- USERS ----------------
    const users = [];
    for (let i = 0; i < 5; i++) {
      users.push(
        new User({
          firstName: faker.person.firstName(),
          lastName: faker.person.lastName(),
          email: faker.internet.email(),
          phone: faker.phone.number(),
          dateOfBirth: faker.date.birthdate({ min: 18, max: 25, mode: "age" }),
          gender: faker.helpers.arrayElement(["male", "female", "other"]),
          institutionId: faker.string.uuid(),
          studentId: faker.string.alphanumeric(8),
          course: faker.word.noun(),
          year: `${faker.number.int({ min: 1, max: 4 })}`,
          department: faker.word.noun(),
          password: "password123", // gets hashed in pre-save hook
          securityQuestion: "What is your favorite color?",
          securityAnswer: "Blue",
          privacyConsent: true,
          dataProcessingConsent: true,
          emergencyContact: faker.person.fullName(),
          emergencyPhone: faker.phone.number(),
          mentalHealthConsent: true,
          communicationConsent: faker.datatype.boolean(),
          role: "student",
        })
      );
    }

    const savedUsers = await User.insertMany(users);

    process.exit();
  } catch (err) {
    console.error("Error seeding data ❌", err);
    process.exit(1);
  }
}

seed();
