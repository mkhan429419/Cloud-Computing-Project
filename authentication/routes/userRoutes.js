const express = require("express");
const {
  createUser,
  loginUser,
  getUserProfile,
  updateStorageUsage,
  validateToken,
  getUserStorage,
  updateBandwidth,
  getBandwidth
} = require("../controllers/userController");
const requireAuth = require("../middleware/auth");

const router = express.Router();

// User APIs
router.post("/register", createUser); // Register a user
router.post("/login", loginUser); // Log in a user
router.get("/profile", requireAuth, getUserProfile); 
router.put("/updateStorageUsage", requireAuth, updateStorageUsage);
router.post("/validate-token", validateToken);
router.get("/storage", requireAuth, getUserStorage);
router.put("/updateBandwidth", requireAuth, updateBandwidth);
router.get("/bandwidth", requireAuth, getBandwidth);

module.exports = router;
