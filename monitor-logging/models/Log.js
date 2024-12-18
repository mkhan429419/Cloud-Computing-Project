const mongoose = require("mongoose");

const LogSchema = new mongoose.Schema({
  userId: { type: String, required: true }, // Firebase User ID
  action: { type: String, required: true }, // Action: upload, delete, replace, etc.
  resource: { type: String }, // Resource: Video, User, etc.
  dataVolume: { type: Number, default: 0 }, // Data used (in bytes)
  status: { type: String, enum: ["success", "failure"], required: true },
  message: { type: String }, // Description or error message
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Log", LogSchema);
