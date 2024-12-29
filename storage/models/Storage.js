const mongoose = require("mongoose");

const VideoSchema = new mongoose.Schema({
  userId: { type: String, required: true }, 
  videoUrl: { type: String, required: true }, 
  publicId: { type: String, required: true }, 
  name: { type: String, required: true }, 
  size: { type: Number, required: true }, 
  createdAt: { type: Date, default: Date.now }, 
});

module.exports = mongoose.model("Video", VideoSchema);
