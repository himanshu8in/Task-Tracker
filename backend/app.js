const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");
const { protect } = require("./middleware/auth");
const errorHandler = require("./middleware/errorHandler");

const app = express();

app.use(cors());
app.use(express.json());

// Mount auth routes
app.use("/api/auth", authRoutes);

// Mount task routes (JWT Protected)
app.use("/api/tasks", protect, taskRoutes);

// Global error handler
app.use(errorHandler);

module.exports = app;