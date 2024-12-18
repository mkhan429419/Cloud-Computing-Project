const Log = require("../models/Log");

// Add a log entry
exports.addLog = async (req, res) => {
  try {
    const { userId, action, resource, dataVolume, status, message } = req.body;

    const log = new Log({
      userId,
      action,
      resource,
      dataVolume,
      status,
      message,
    });

    await log.save();
    res.status(201).json({ message: "Log entry added successfully" });
  } catch (error) {
    console.error("Error adding log:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

// Retrieve all logs
exports.getLogs = async (req, res) => {
  try {
    const logs = await Log.find().sort({ timestamp: -1 });
    res.status(200).json({ logs });
  } catch (error) {
    console.error("Error fetching logs:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

// Retrieve logs for a specific user
exports.getLogsByUser = async (req, res) => {
  const { userId } = req.params;

  try {
    const logs = await Log.find({ userId }).sort({ timestamp: -1 });
    res.status(200).json({ logs });
  } catch (error) {
    console.error("Error fetching user logs:", error);
    res.status(500).json({ message: "Server error", error });
  }
};
