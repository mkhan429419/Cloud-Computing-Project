const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const UserSchema = new mongoose.Schema({
  firebaseUserId: { type: String, required: true, unique: true }, 
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, 
  name: { type: String, required: true },
  storageUsed: { type: Number, default: 0 }, 
  dailyBandwidthUsed: { type: Number, default: 0 }, 
  createdAt: { type: Date, default: Date.now },
});

// Hash password before saving the user
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next(); 

  try {
    const salt = await bcrypt.genSalt(10); 
    this.password = await bcrypt.hash(this.password, salt); 
    next();
  } catch (error) {
    next(error); 
  }
});

module.exports = mongoose.model("User", UserSchema);
