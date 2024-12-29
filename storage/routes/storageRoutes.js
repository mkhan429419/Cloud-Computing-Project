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
const validateToken = require("../middleware/auth"); 
const logRequest = require("../middleware/logMiddleware"); 

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage }); 

// Video Routes
router.post(
  "/upload",
  validateToken, 
  logRequest, 
  upload.single("video"),
  uploadVideo
);

router.put(
  "/replace",
  validateToken, 
  logRequest, 
  upload.single("video"),
  replaceVideo
);

router.delete(
  "/delete",
  validateToken, 
  logRequest, 
  deleteVideo
);

router.delete(
  "/bulk-delete",
  validateToken, 
  logRequest,
  bulkDeleteVideos
);

// GET Routes (No logging needed for GET requests)
router.get("/:userId/videos", validateToken, getVideos);
router.get("/video/:videoId", validateToken, getVideoById);

module.exports = router;
