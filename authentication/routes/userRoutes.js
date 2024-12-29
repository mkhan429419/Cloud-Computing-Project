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
const logRequest = require("../middleware/logMiddleware"); 

const router = express.Router();

// User APIs
router.post("/register", logRequest, createUser); 
router.post("/login", logRequest, loginUser); 
router.post("/validate-token", logRequest, validateToken); 

router.put(
  "/updateStorageUsage",
  requireAuth,
  logRequest, 
  updateStorageUsage
);

router.put(
  "/updateBandwidth",
  requireAuth,
  logRequest, 
  updateBandwidth
);

// GET routes (No logging required)
router.get("/profile", requireAuth, getUserProfile);
router.get("/storage", requireAuth, getUserStorage);
router.get("/bandwidth", requireAuth, getBandwidth);

module.exports = router;
