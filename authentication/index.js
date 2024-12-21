const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const cors = require("cors");
const cron = require("node-cron"); // Cron Scheduler
const axios = require("axios"); // To log reset actions

// Load environment variables
dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB Atlas
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Import routes
const userRoutes = require("./routes/userRoutes");
const User = require("./models/User");

// Use routes
app.use("/api/users", userRoutes);

// Scheduled Task: Reset Daily Bandwidth at Midnight
cron.schedule("0 0 * * *", async () => {
  try {
    console.log("Running daily bandwidth reset...");

    // Reset daily bandwidth for all users
    await User.updateMany({}, { dailyBandwidthUsed: 0 });

    console.log("Daily bandwidth reset successfully.");

    // Log the action to the Logging Microservice
    await axios.post(
      "https://monitor-logging-service-967652754037.asia-east1.run.app/api/logs/create",
      {
        userId: "SYSTEM", // Indicating it's a system action
        action: "RESET_DAILY_BANDWIDTH",
        status: "SUCCESS",
        message: "Daily bandwidth reset for all users.",
      }
    );
  } catch (error) {
    console.error("Error resetting daily bandwidth:", error);

    // Log the failure to the Logging Microservice
    await axios.post(
      "https://monitor-logging-service-967652754037.asia-east1.run.app/api/logs/create",
      {
        userId: "SYSTEM",
        action: "RESET_DAILY_BANDWIDTH",
        status: "FAILURE",
        message: error.message || "Failed to reset daily bandwidth.",
      }
    );
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`User Account Management Service running on port ${PORT}`);
});
