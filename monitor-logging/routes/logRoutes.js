const express = require("express");
const {
  addLog,
  getLogs,
  getLogsByUser,
} = require("../controllers/logController");

const router = express.Router();

// Routes for logging
router.post("/log", addLog); 
router.get("/logs", getLogs); 
router.get("/logs/user/:userId", getLogsByUser); 

module.exports = router;
