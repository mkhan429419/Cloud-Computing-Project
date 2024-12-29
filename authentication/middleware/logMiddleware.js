const axios = require("axios");
const admin = require("../firebaseAdmin"); 

// Middleware to log API actions
const logRequest = async (req, res, next) => {
  
  if (req.method === "GET") {
    return next();
  }

  const { method, originalUrl } = req;
  const dataVolume = req.headers["content-length"] || 0;
  const action = method; 
  const resource = originalUrl; 

  let userId = "Unknown"; 

  // Extract userId from req.user or Authorization header
  try {
    if (req.user?.firebaseUserId) {
      userId = req.user.firebaseUserId; 
    } else if (req.headers.authorization) {
      const token = req.headers.authorization.split(" ")[1];
      const decodedToken = await admin.auth().verifyIdToken(token);
      userId = decodedToken.uid; 
    }
  } catch (error) {
    console.error("Error decoding token in log middleware:", error.message);
  }

 
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
      await axios.post(
        "https://monitor-logging-service-967652754037.asia-east1.run.app/api/monitoring/log",
        logPayload
      );
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
