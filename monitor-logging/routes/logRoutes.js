const express = require("express");
const {
  addLog,
  getLogs,
  getLogsByUser,
} = require("../controllers/logController");

const router = express.Router();

// Routes for logging
router.post("/log", addLog); // Add log entry
router.get("/logs", getLogs); // Retrieve all logs
router.get("/logs/user/:userId", getLogsByUser); // Retrieve logs for specific user

module.exports = router;
