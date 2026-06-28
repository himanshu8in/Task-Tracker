const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");
const { protect } = require("./middleware/auth");
const errorHandler = require("./middleware/errorHandler");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Health check route
app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Task Tracker Backend is Running 🚀"
    });
});

// Auth routes
app.use("/api/auth", authRoutes);

// Task routes (Protected)
app.use("/api/tasks", protect, taskRoutes);

// Global error handler
app.use(errorHandler);

module.exports = app;