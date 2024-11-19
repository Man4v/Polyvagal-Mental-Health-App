const express = require("express");
const axios = require("axios");
const router = express.Router();

router.post("/copingsuggestions", async (req, res) => {
  const { resources } = req.body;

  try {
    // Send selected resources to the AI model for generating coping strategies
    const response = await axios.post("https://your-fine-tuned-chatbot-api.com/copingsuggestions", {
      resources: resources
    }, {
      headers: {
        Authorization: `Bearer ${process.env.CHATBOT_API_KEY}`,
        "Content-Type": "application/json"
      }
    });

    const copingSuggestions = response.data.suggestions;
    res.json({ suggestions: copingSuggestions });
  } catch (error) {
    console.error("Error getting coping suggestions:", error);
    res.status(500).json({ error: "Failed to get coping suggestions from API." });
  }
});

module.exports = router;
