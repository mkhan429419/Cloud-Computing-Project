const mongoose = require("mongoose");

const LogSchema = new mongoose.Schema({
  userId: { type: String, required: true }, 
  action: { type: String, required: true }, 
  resource: { type: String }, 
  dataVolume: { type: Number, default: 0 }, 
  status: { type: String, enum: ["success", "failure"], required: true },
  message: { type: String }, 
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Log", LogSchema);
