const axios = require("axios");
const admin = require("../firebaseAdmin"); // Firebase Admin SDK for decoding token

// Middleware to log API actions
const logRequest = async (req, res, next) => {
  // Skip GET requests
  if (req.method === "GET") {
    return next();
  }

  const { method, originalUrl } = req; // Request details
  const dataVolume = req.headers["content-length"] || 0; // Approximate data size
  const action = `${method} ${originalUrl}`; // e.g., POST /api/storage/upload
  const resource = originalUrl; // API endpoint being accessed

  let userId = "Unknown"; // Default value

  // Extract userId from req.user, req.body, or decode Authorization header
  try {
    if (req.user?.firebaseUserId) {
      userId = req.user.firebaseUserId; // Authenticated requests
    } else if (req.body?.userId) {
      userId = req.body.userId; // Internal programmatic requests
    } else if (req.headers.authorization) {
      const token = req.headers.authorization.split(" ")[1];
      const decodedToken = await admin.auth().verifyIdToken(token);
      userId = decodedToken.uid;
      req.user = { firebaseUserId: userId }; // Attach to req.user for consistency
    }
  } catch (error) {
    console.error("Error decoding token in log middleware:", error.message);
  }

  // Hook into res.send to ensure we log after the response is sent
  const originalSend = res.send;
  res.send = async function (body) {
    const logStatus = res.statusCode < 400 ? "success" : "error";

    const logPayload = {
      userId,
      action,
      resource,
      dataVolume: Number(dataVolume),
      status: logStatus,
      message:
        res.statusCode < 400 ? "Operation successful" : "Operation failed",
    };

    try {
      await axios.post("http://localhost:5001/api/monitoring/log", logPayload);
      console.log(`Log successfully created for: ${action}`);
    } catch (error) {
      console.error(
        "Error sending log to Monitor-Logging Service:",
        error.message
      );
    }

    return originalSend.apply(res, arguments);
  };

  next();
};

module.exports = logRequest;
