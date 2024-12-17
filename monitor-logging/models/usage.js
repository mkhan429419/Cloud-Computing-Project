const mongoose = require("mongoose");

const usageSchema = new mongoose.Schema({
  firebaseUserId: { type: String, required: true },
  date: { type: Date, default: new Date() },
  //date: { type: Date, default: Date.now },
  timestamp: { type: Date, default: Date.now },
  dailyBandwidthUsed: { type: Number, default: 0 },
});

module.exports = mongoose.model("Usage", usageSchema);
