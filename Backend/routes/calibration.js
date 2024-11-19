// routes/calibration.js
const express = require("express");
const router = express.Router();

// Temporary in-memory storage for calibration data
const calibrationData = {};

router.post("/:stateType", (req, res) => {
  const { stateType } = req.params;
  const { userId, data } = req.body;

  // Store calibration data by user and state type
  if (!calibrationData[userId]) calibrationData[userId] = {};
  calibrationData[userId][stateType] = data;

  res.status(200).json({ message: `Calibration data for ${stateType} saved successfully.` });
});

module.exports = router;
