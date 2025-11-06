import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import { createServer } from "node:http";
import { Server } from "socket.io";
import path from "path";
import { fileURLToPath } from "url";

// Import your Express routes
import adminRoutes from "./routes/adminRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import userDetailsRoutes from "./routes/userDetailsRoutes.js";
import assessmentRoutes from "./routes/assessmentRoutes.js";
import appointmentRoutes from "./routes/appointmentRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import crisisRoutes from "./routes/crisisRoutes.js";
import resourceRoutes from "./routes/resourceRoutes.js";
import counselorRoutes from "./routes/counselorRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import communityRoutes from "./routes/communityRoutes.js";
import journalRoutes from "./routes/journalRoutes.js";
import counselorDashboardRoutes from "./routes/counselorDashboardRoutes.js";
import moodTrackingRoutes from "./routes/moodTrackingRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: { origin: "*" },
});

// ------------------ SOCKET.IO LOGIC ------------------

// Active rooms: { roomId: [ { id } ] }
const rooms = {};
// Online users
let onlineCounselors = new Map();
const onlineStudents = new Map();

io.on("connection", (socket) => {
  console.log("✅ Socket connected:", socket.id);

  // --- Presence ---
  socket.on("counselor-online", (counselorID) => {
    onlineCounselors.set(counselorID, socket.id);
    console.log(`🎯 Counselor ${counselorID} online`);
    io.emit("counselor-status", { counselorID, isOnline: true });
  });

  socket.on("student-online", (studentID) => {
    onlineStudents.set(studentID, socket.id);
    console.log(`🎓 Student ${studentID} online`);
    io.emit("student-status", { studentID, isOnline: true });
  });

  // --- WebRTC Room Join ---
  socket.on("room:join", ({ room }) => {
    if (!rooms[room]) rooms[room] = [];

    // if (rooms[room].length >= 2) {
    //   socket.emit("room:full");
    //   return;
    // }

    rooms[room].push({ id: socket.id });
    socket.join(room);

    const otherUsers = rooms[room].filter((u) => u.id !== socket.id);
    socket.emit("room:join", { room, otherUsers });
    socket.to(room).emit("user:joined", { id: socket.id });
  });

  // --- WebRTC Signaling ---
  socket.on("user:call", ({ to, offer }) => {
    io.to(to).emit("incomming:call", { from: socket.id, offer });
  });

  socket.on("call:accepted", ({ to, ans }) => {
    io.to(to).emit("call:accepted", { from: socket.id, ans });
  });

  socket.on("peer:nego:needed", ({ to, offer }) => {
    io.to(to).emit("peer:nego:needed", { from: socket.id, offer });
  });

  socket.on("peer:nego:done", ({ to, ans }) => {
    io.to(to).emit("peer:nego:final", { from: socket.id, ans });
  });

  // --- ICE Candidate Exchange (important!) ---
  socket.on("peer:ice-candidate", ({ to, candidate }) => {
    io.to(to).emit("peer:ice-candidate", { from: socket.id, candidate });
  });

  // --- Room Leave ---
  socket.on("room:leave", ({ room }) => {
    leaveRoom(socket, room);
  });

  // --- Disconnect ---
  socket.on("disconnect", () => {
    // Presence cleanup
    for (let [counselorID, sockId] of onlineCounselors.entries()) {
      if (sockId === socket.id) {
        onlineCounselors.delete(counselorID);
        console.log(`❌ Counselor ${counselorID} offline`);
        io.emit("counselor-status", { counselorID, isOnline: false });
      }
    }
    for (let [studentID, sockId] of onlineStudents.entries()) {
      if (sockId === socket.id) {
        onlineStudents.delete(studentID);
        console.log(`❌ Student ${studentID} offline`);
        io.emit("student-status", { studentID, isOnline: false });
      }
    }

    // Room cleanup
    for (const room in rooms) {
      const user = rooms[room].find((u) => u.id === socket.id);
      if (user) leaveRoom(socket, room);
    }

    console.log(`🔌 Socket disconnected: ${socket.id}`);
  });

  // Helper
  function leaveRoom(socket, room) {
    if (rooms[room]) {
      rooms[room] = rooms[room].filter((u) => u.id !== socket.id);
      socket.to(room).emit("user:left", { id: socket.id });
      if (rooms[room].length === 0) delete rooms[room];
    }
    socket.leave(room);
    console.log(`👋 User ${socket.id} left room ${room}`);
  }
});

// ------------------ EXPRESS CONFIG ------------------

// Enhanced CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (
      process.env.CORS_DEBUG === "true" ||
      process.env.NODE_ENV !== "production" ||
      process.env.ALLOW_ALL_ORIGINS === "true"
    ) {
      return callback(null, true);
    }
    const allowedOriginsFromEnv = process.env.ALLOWED_ORIGINS
      ? process.env.ALLOWED_ORIGINS.split(",").map((o) => o.trim())
      : [];
    const frontendUrl = process.env.FRONTEND_URL;
    const allowedOrigins = [...allowedOriginsFromEnv, frontendUrl].filter(Boolean);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-Requested-With",
    "Accept",
    "Origin",
    "Access-Control-Request-Method",
    "Access-Control-Request-Headers",
  ],
};

app.use(cors(corsOptions));

// CORS debug middleware
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin) res.header("Access-Control-Allow-Origin", origin);
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, X-Requested-With, Accept, Origin, Access-Control-Request-Method, Access-Control-Request-Headers"
  );
  if (req.method === "OPTIONS") return res.sendStatus(200);
  next();
});

// Standard middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB error:", err));

// Routes
app.use("/api/users", userRoutes);
app.use("/api/user-details", userDetailsRoutes);
app.use("/api/assessments", assessmentRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/crisis", crisisRoutes);
app.use("/api/resources", resourceRoutes);
app.use("/api/counselors", counselorRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/community", communityRoutes);
app.use("/api/journal", journalRoutes);
app.use("/api/counselor-dashboard", counselorDashboardRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/mood", moodTrackingRoutes);
app.use("/api/messages", messageRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "MindCare API is running",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
  });
});

// CORS test
app.get("/api/cors-test", (req, res) => {
  const origin = req.headers.origin;
  res.status(200).json({
    status: "success",
    message: "CORS test successful",
    origin,
    timestamp: new Date().toISOString(),
  });
});

// Root
app.get("/", (req, res) => {
  res.json({
    message: "MindCare API is running",
    version: "1.0.0",
    environment: process.env.NODE_ENV || "development",
    timestamp: new Date().toISOString(),
  });
});

// 404
app.use("*", (req, res) => {
  res.status(404).json({
    status: "error",
    message: `Route ${req.originalUrl} not found`,
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error("Global error:", err);
  if (err.message === "Not allowed by CORS") {
    return res.status(403).json({
      status: "error",
      message: "CORS Error: Origin not allowed",
    });
  }
  res.status(err.statusCode || 500).json({
    status: err.status || "error",
    message: err.message || "Internal server error",
  });
});

// Start server
const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || "development"}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
});
