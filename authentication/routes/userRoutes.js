const express = require("express");
const {
  createUser,
  loginUser,
  getUserProfile,
  updateStorageUsage,
  validateToken,
  getUserStorage,
  updateBandwidth,
  getBandwidth,
} = require("../controllers/userController");
const requireAuth = require("../middleware/auth");
const logRequest = require("../middleware/logMiddleware"); // Import log middleware

const router = express.Router();

// User APIs
router.post("/register", logRequest, createUser); // Log entry for register
router.post("/login", logRequest, loginUser); // Log entry for login
router.post("/validate-token", logRequest, validateToken); // Log entry for token validation

router.put(
  "/updateStorageUsage",
  requireAuth,
  logRequest, // Log entry for updateStorageUsage
  updateStorageUsage
);

router.put(
  "/updateBandwidth",
  requireAuth,
  logRequest, // Log entry for updateBandwidth
  updateBandwidth
);

// GET routes (No logging required)
router.get("/profile", requireAuth, getUserProfile);
router.get("/storage", requireAuth, getUserStorage);
router.get("/bandwidth", requireAuth, getBandwidth);

module.exports = router;
