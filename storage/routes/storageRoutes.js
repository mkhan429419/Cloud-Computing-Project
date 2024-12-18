const express = require("express");
const multer = require("multer");
const {
  uploadVideo,
  replaceVideo,
  getVideos,
  getVideoById,
  deleteVideo,
  bulkDeleteVideos,
} = require("../controllers/storageController");
const validateToken = require("../middleware/auth"); // Authentication middleware
const logRequest = require("../middleware/logMiddleware"); // Logging middleware

const router = express.Router();
const upload = multer({ dest: "uploads/" }); // Multer configuration

// Video Routes
router.post(
  "/upload",
  validateToken, // Validate token first
  logRequest, // Log the request
  upload.single("video"),
  uploadVideo
);

router.put(
  "/replace",
  validateToken, // Validate token first
  logRequest, // Log the request
  upload.single("video"),
  replaceVideo
);

router.delete(
  "/delete",
  validateToken, // Validate token first
  logRequest, // Log the request
  deleteVideo
);

router.delete(
  "/bulk-delete",
  validateToken, // Validate token first
  logRequest, // Log the request
  bulkDeleteVideos
);

// GET Routes (No logging needed for GET requests)
router.get("/:userId/videos", validateToken, getVideos);
router.get("/video/:videoId", validateToken, getVideoById);

module.exports = router;
