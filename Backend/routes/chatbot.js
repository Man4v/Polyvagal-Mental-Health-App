const express = require("express");
const axios = require("axios");
const router = express.Router();

router.post("/", async (req, res) => {
  const { prompt } = req.body;

  try {
    // Send prompt to the chatbot API
    const response = await axios.post("https://your-fine-tuned-chatbot-api.com/chat", {
      prompt
    }, {
      headers: {
        Authorization: `Bearer ${process.env.CHATBOT_API_KEY}`,
        "Content-Type": "application/json"
      }
    });

    // Assuming the API can signal if resources are required by returning a specific flag
    const botResponse = response.data.reply;
    const requiresResourceSelection = response.data.requiresResourceSelection || false;
    const promptForResources = "Please select the resources available to you:";

    // If resources are needed, include the flag and prompt
    if (requiresResourceSelection) {
      res.json({
        reply: botResponse,
        requiresResourceSelection: true,
        promptForResources: promptForResources
      });
    } else {
      // Regular chatbot response without resource selection
      res.json({ reply: botResponse, requiresResourceSelection: false });
    }
  } catch (error) {
    console.error("Error communicating with chatbot API:", error);
    res.status(500).json({ error: "Failed to get response from chatbot." });
  }
});

module.exports = router;
