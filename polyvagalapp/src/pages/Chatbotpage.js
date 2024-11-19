import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import '../Chatbot.css';

const ChatbotPage = () => {
  const [calibrationData, setCalibrationData] = useState(null);  // Load once when the user arrives
  const [resources, setResources] = useState([]);
  const [location, setLocation] = useState('');
  const [currentSituation, setCurrentSituation] = useState('');
  const [chatResponse, setChatResponse] = useState('');
  const [conversationHistory, setConversationHistory] = useState([]); // Stores conversation history
  const [userInput, setUserInput] = useState(''); // Stores user input for each turn

  useEffect(() => {
    axios.get('/get-calibration-data').then((res) => {
      setCalibrationData(res.data);
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Append user input to conversation history
    const updatedHistory = [
      ...conversationHistory,
      { role: "user", content: userInput }
    ];

    const requestData = {
      calibrationData,
      resources,
      location,
      currentSituation,
      conversationHistory: updatedHistory // Send conversation history to backend
    };

    try {
      const response = await axios.post('http://localhost:5000/chatbot', requestData);
      const botMessage = response.data.response;
      
      // Update conversation history with bot response and reset user input
      setConversationHistory([...updatedHistory, { role: "assistant", content: botMessage }]);
      setChatResponse(botMessage);
      setUserInput('');
    } catch (error) {
      console.error('Error communicating with chatbot:', error);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="chatbot-container">
        <h1>Chatbot</h1>
        
        {/* Chat history display */}
        <div className="chat-history">
          {conversationHistory.map((message, index) => (
            <div key={index} className={`message ${message.role}`}>
              <strong>{message.role === 'user' ? 'You' : 'Bot'}:</strong> {message.content}
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="chatbot-form">
          {/* Resource Selection */}
          <div className="form-section">
            <h2>Select Available Resources</h2>
            <label><input type="checkbox" value="music" onChange={(e) => setResources([...resources, e.target.value])} /> Music</label>
            <label><input type="checkbox" value="private space" onChange={(e) => setResources([...resources, e.target.value])} /> Private Space</label>
          </div>

          {/* Location Selection */}
          <div className="form-section">
            <h2>Select Location</h2>
            <select value={location} onChange={(e) => setLocation(e.target.value)}>
              <option value="">Select</option>
              <option value="home">Home</option>
              <option value="office">Office</option>
            </select>
          </div>

          {/* Situation Input */}
          <div className="form-section">
            <h2>Current Situation</h2>
            <textarea
              value={currentSituation}
              onChange={(e) => setCurrentSituation(e.target.value)}
              placeholder="Describe your current situation..."
            ></textarea>
          </div>

          {/* User Input for Conversation */}
          <div className="form-section">
            <h2>Your Message</h2>
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Type your message..."
            />
          </div>

          <button type="submit">Send</button>
        </form>
      </div>
    </div>
  );
};

export default ChatbotPage;
