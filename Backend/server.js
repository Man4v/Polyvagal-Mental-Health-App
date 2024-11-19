const express = require('express');
// const bodyParser = require('body-parser');
const axios = require('axios');
const cors = require('cors');
const app = express();
const db = require('./db');
const dotenv = require('dotenv');
dotenv.config();

app.use(cors({
    origin: 'http://localhost:3000'  // Allow requests from this origin
  }));

app.use(express.json());
const API_KEY = process.env.CHATBOT_API_KEY;

// Endpoint to handle form submissions
app.post('/submit-inputs', (req, res) => {
    const { stateType, data } = req.body;
    console.log('Received data:', stateType, data); // Log to confirm data received
    res.status(200).json({ message: 'Data received successfully!' });

  if (!stateType) {
    console.error("stateType is missing");
    return res.status(400).json({ error: "stateType is required" });
  }

  const query = `
    INSERT INTO UserInputs (state_type, colors, imagery, sensations, emotions, actions, memories, iamblank, worldisblank)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

const values = [
    stateType,
    data.colors || null,
    data.imagery || null,
    data.sensations || null,
    data.emotions || null,
    data.actions || null,
    data.memories || null,
    data.identity || null,
    data.world || null
  ];

  db.query(query, values, (err, result) => {
    if (err) {
      console.error('Error inserting form data:', err);
      return res.status(500).json({ error: 'Failed to save data' });
    }
    res.status(200).json({ message: 'Data saved successfully', result });
  });
});

const getLatestCalibrationData = async () => {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT state_type, colors, imagery, sensations, emotions, actions, memories, iamblank, worldisblank
        FROM UserInputs
        WHERE (state_type, created_at) IN (
          SELECT state_type, MAX(created_at)
          FROM UserInputs
          GROUP BY state_type
        )
      `;
  
      db.query(query, (err, results) => {
        if (err) {
          return reject(err);
        }
  
        // Transform results into an object with state_type as keys
        const calibrationData = results.reduce((acc, row) => {
          acc[row.state_type] = row;
          return acc;
        }, {});
  
        resolve(calibrationData);
      });
    });
  };


  app.post('/chatbot', async (req, res) => {
    const { resources, location, currentSituation, conversationHistory } = req.body;
  
    try {
      // Retrieve the latest calibration data
      const calibrationData = await getLatestCalibrationData();
  
      // Create the prompt with user context and all three state profiles
      const prompt = `
        Personal Nervous System Profile Map of the user:
        
        Hyperarousal State:
        - Colors: ${calibrationData.hyperarousal?.colors || ''}
        - Imagery: ${calibrationData.hyperarousal?.imagery || ''}
        - Sensations: ${calibrationData.hyperarousal?.sensations || ''}
        - Emotions: ${calibrationData.hyperarousal?.emotions || ''}
        - Actions: ${calibrationData.hyperarousal?.actions || ''}
        - Memories: ${calibrationData.hyperarousal?.memories || ''}
        - Self-description ("I am"): ${calibrationData.hyperarousal?.identity || ''}
        - World-view ("The world is"): ${calibrationData.hyperarousal?.worldisblank || ''}
  
        Hypoarousal State:
        - Colors: ${calibrationData.hypoarousal?.colors || ''}
        - Imagery: ${calibrationData.hypoarousal?.imagery || ''}
        - Sensations: ${calibrationData.hypoarousal?.sensations || ''}
        - Emotions: ${calibrationData.hypoarousal?.emotions || ''}
        - Actions: ${calibrationData.hypoarousal?.actions || ''}
        - Memories: ${calibrationData.hypoarousal?.memories || ''}
        - Self-description ("I am"): ${calibrationData.hypoarousal?.identity || ''}
        - World-view ("The world is"): ${calibrationData.hypoarousal?.worldisblank || ''}
  
        Flow State:
        - Colors: ${calibrationData.flow?.colors || ''}
        - Imagery: ${calibrationData.flow?.imagery || ''}
        - Sensations: ${calibrationData.flow?.sensations || ''}
        - Emotions: ${calibrationData.flow?.emotions || ''}
        - Actions: ${calibrationData.flow?.actions || ''}
        - Memories: ${calibrationData.flow?.memories || ''}
        - Self-description ("I am"): ${calibrationData.flow?.identity || ''}
        - World-view ("The world is"): ${calibrationData.flow?.worldisblank || ''}
  
        Resources available: ${resources.join(', ')}
        Location: ${location}
  
        The user has reported the following situation: ${currentSituation}.
        Below is the ongoing conversation context:
        ${conversationHistory.map(entry => `${entry.role === 'user' ? 'User' : 'Assistant'}: ${entry.content}`).join('\n')}
  
        Continue the conversation in a helpful and supportive manner.
      `;
  
      // Send the prompt to Hugging Face’s API
      const response = await axios.post(
        'https://api-inference.huggingface.co/models/meta-llama/Llama-2-7b-chat-hf',
        { inputs: prompt },
        {
          headers: {
            Authorization: `Bearer ${API_KEY}`,
            'Content-Type': 'application/json'
          }
        }
      );
  
      const botResponse = response.data.generated_text;
      res.json({ response: botResponse });
    } catch (error) {
      console.error('Error with Hugging Face API or database:', error);
      res.status(500).json({ error: 'Failed to get response from chatbot' });
    }
  });
  
  
  
// const PORT = process.env.PORT || 5000;
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
