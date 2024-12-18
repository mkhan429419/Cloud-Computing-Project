const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const logRoutes = require("./routes/logRoutes");

dotenv.config();

const app = express();
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Monitor-Logging Service connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Routes
app.use("/api/monitoring", logRoutes);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () =>
  console.log(`Monitor-Logging Service running on port ${PORT}`)
);
