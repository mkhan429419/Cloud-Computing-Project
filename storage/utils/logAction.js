const axios = require("axios");

const logAction = async (logData) => {
  try {
    await axios.post("http://localhost:5001/api/monitoring/log", logData);
    console.log("Log created successfully:", logData.action);
  } catch (error) {
    console.error("Error creating log:", error.message);
  }
};

module.exports = logAction;
