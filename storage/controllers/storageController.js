const cloudinary = require("../cloudinaryConfig");
const Video = require("../models/Storage");
const fetch = require("node-fetch");

const AUTH_SERVICE_URL =
  "https://authentication-service-967652754037.asia-east1.run.app/api/users";

const getUserStorage = async (userId, token) => {
  try {
    const response = await fetch(`${AUTH_SERVICE_URL}/storage`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: token, // Pass the token from the request
      },
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("Failed to fetch user storage details:", error);
      throw new Error("Failed to fetch user storage details");
    }

    return await response.json();
  } catch (error) {
    console.error("Error calling getUserStorage API:", error);
    throw error;
  }
};

// Helper function to update storage usage
const updateStorageUsage = async (userId, usageDelta, token) => {
  try {
    const response = await fetch(`${AUTH_SERVICE_URL}/updateStorageUsage`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: token, // Pass the token from the request
      },
      body: JSON.stringify({ userId, usageDelta }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("Failed to update storage usage:", error);
    }
  } catch (error) {
    console.error("Error calling updateStorageUsage API:", error);
  }
};

const getUserBandwidth = async (userId, token) => {
  const response = await fetch(`${AUTH_SERVICE_URL}/bandwidth`, {
    method: "GET",
    headers: { Authorization: token },
  });
  if (!response.ok) throw new Error("Failed to fetch bandwidth details");
  return await response.json();
};

// Helper: Update bandwidth usage
const updateBandwidth = async (userId, dataVolume, token) => {
  const response = await fetch(`${AUTH_SERVICE_URL}/updateBandwidth`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", Authorization: token },
    body: JSON.stringify({ userId, dataVolume }),
  });
  return await response.json();
};

// Upload a video
exports.uploadVideo = async (req, res) => {
  const { name } = req.body;
  const file = req.file; // File uploaded in memory

  try {
    if (!file) {
      return res.status(400).json({ message: "No video file provided" });
    }

    const userId = req.user.firebaseUserId;
    const token = req.headers.authorization;

    // Fetch and check bandwidth
    const bandwidth = await getUserBandwidth(userId, token);
    if (bandwidth.isLimitExceeded || bandwidth.remainingBandwidth < file.size) {
      return res.status(400).json({
        message: "Daily bandwidth limit exceeded. Cannot upload video.",
      });
    }

    // Fetch user storage details
    const userStorage = await getUserStorage(
      req.user.firebaseUserId,
      req.headers.authorization
    );

    if (userStorage.remainingStorage < file.size) {
      return res.status(400).json({
        message: "Not enough storage available. Please free up space.",
      });
    }

    // Upload video to Cloudinary using buffer
    const result = await cloudinary.uploader.upload_stream(
      { resource_type: "video" },
      async (error, result) => {
        if (error) throw new Error("Error uploading video to Cloudinary");

        // Save video details to MongoDB
        const video = new Video({
          userId: req.user.firebaseUserId,
          videoUrl: result.secure_url,
          publicId: result.public_id,
          name,
          size: file.size,
        });

        await video.save();

        // Update storage and bandwidth usage
        await updateStorageUsage(userId, file.size, token);
        await updateBandwidth(userId, file.size, token);

        res.status(200).json({ message: "Video uploaded successfully", video });
      }
    );

    // Write file buffer to the Cloudinary stream
    result.end(file.buffer);
  } catch (error) {
    console.error("Error uploading video:", error);
    res.status(500).json({ message: "Error uploading video", error });
  }
};

// Replace a video
exports.replaceVideo = async (req, res) => {
  const { videoId, name } = req.body;
  const file = req.file; // File uploaded in memory

  try {
    if (!file) {
      return res.status(400).json({ message: "No video file provided" });
    }

    const userId = req.user.firebaseUserId;
    const token = req.headers.authorization;

    // Fetch and check bandwidth
    const bandwidth = await getUserBandwidth(userId, token);
    if (bandwidth.isLimitExceeded || bandwidth.remainingBandwidth < file.size) {
      return res.status(400).json({
        message: "Daily bandwidth limit exceeded. Cannot replace video.",
      });
    }

    const video = await Video.findById(videoId);

    if (!video || video.userId !== req.user.firebaseUserId) {
      return res
        .status(404)
        .json({ message: "Video not found or unauthorized" });
    }

    // Delete the old video from Cloudinary
    await cloudinary.uploader.destroy(video.publicId, {
      resource_type: "video",
    });

    // Upload the new video to Cloudinary using buffer
    const uploadPromise = new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { resource_type: "video" },
        async (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      );

      // Write the file buffer to the Cloudinary upload stream
      uploadStream.end(file.buffer);
    });

    const result = await uploadPromise;

    // Update video details in MongoDB
    const oldSize = video.size; // Track the size of the old video
    video.videoUrl = result.secure_url;
    video.publicId = result.public_id;
    video.name = name;
    video.size = file.size;

    await video.save();

    // Update storage usage
    const usageDelta = file.size - oldSize;
    await updateStorageUsage(userId, usageDelta, token);
    await updateBandwidth(userId, file.size, token);

    res.status(200).json({ message: "Video replaced successfully", video });
  } catch (error) {
    console.error("Error replacing video:", error);
    res.status(500).json({ message: "Error replacing video", error });
  }
};

// Get all videos for a user
exports.getVideos = async (req, res) => {
  try {
    const videos = await Video.find({ userId: req.user.firebaseUserId });

    res.status(200).json({ videos });
  } catch (error) {
    console.error("Error fetching videos:", error);
    res.status(500).json({ message: "Error fetching videos", error });
  }
};

// Get a single video
exports.getVideoById = async (req, res) => {
  const { videoId } = req.params;

  try {
    const video = await Video.findById(videoId);

    if (!video || video.userId !== req.user.firebaseUserId) {
      return res
        .status(404)
        .json({ message: "Video not found or unauthorized" });
    }

    res.status(200).json({ video });
  } catch (error) {
    console.error("Error fetching video:", error);
    res.status(500).json({ message: "Error fetching video", error });
  }
};

// Delete a single video
exports.deleteVideo = async (req, res) => {
  const { videoId } = req.body;

  try {
    const userId = req.user.firebaseUserId;
    const token = req.headers.authorization;

    const video = await Video.findById(videoId);

    if (!video || video.userId !== req.user.firebaseUserId) {
      return res
        .status(404)
        .json({ message: "Video not found or unauthorized" });
    }

    // Delete video from Cloudinary
    await cloudinary.uploader.destroy(video.publicId, {
      resource_type: "video",
    });

    // Delete video from MongoDB using deleteOne
    const size = video.size; // Track size for updating storage
    await Video.deleteOne({ _id: videoId });

    // Update storage usage
    await updateStorageUsage(userId, -size, token);

    res.status(200).json({ message: "Video deleted successfully" });
  } catch (error) {
    console.error("Error deleting video:", error);
    res.status(500).json({ message: "Error deleting video", error });
  }
};

// Bulk delete videos
exports.bulkDeleteVideos = async (req, res) => {
  const { videoIds } = req.body;

  try {
    const userId = req.user.firebaseUserId;
    const token = req.headers.authorization;

    const videos = await Video.find({
      _id: { $in: videoIds },
      userId: req.user.firebaseUserId,
    });

    if (videos.length === 0) {
      return res
        .status(404)
        .json({ message: "No videos found or unauthorized" });
    }

    // Delete videos from Cloudinary
    const publicIds = videos.map((video) => video.publicId);
    await cloudinary.api.delete_resources(publicIds, {
      resource_type: "video",
    });

    // Calculate total storage to free
    const totalSize = videos.reduce((acc, video) => acc + video.size, 0);

    // Delete videos from MongoDB
    await Video.deleteMany({ _id: { $in: videoIds } });

    // Update storage usage
    await updateStorageUsage(userId, -totalSize, token);

    res.status(200).json({ message: "Videos deleted successfully" });
  } catch (error) {
    console.error("Error bulk deleting videos:", error);
    res.status(500).json({ message: "Error bulk deleting videos", error });
  }
};
