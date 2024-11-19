import React, { useState } from "react";
import '../App.css';
import AudioPlayer from "react-audio-player";
import Navbar from "../components/Navbar";
import axios from 'axios';


const CalibrationPage = () => {
  const [selectedAudio, setSelectedAudio] = useState(null);
  const [formData, setFormData] = useState({
    hyperarousal: {},
    hypoarousal: {},
    flow: {}
  });
  const [submittedStates, setSubmittedStates] = useState({
    hyperarousal: false,
    hypoarousal: false,
    flow: false
  });
  const [thankYouPlayed, setThankYouPlayed] = useState(false);


  const audioSources = {
    hyperarousal: "../Hyperarousal.mp3",
    hypoarousal: "../Hypoarousal.mp3",
    flow: "../FlowState.mp3"
  };

  const handleFormSubmit = async (stateType, e) => {
    e.preventDefault();
    console.log(`Data for ${stateType}:`, formData[stateType]);
  
    try {
      const response = await fetch('http://localhost:5000/submit-inputs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ stateType, data: formData[stateType] })
      });
  
      if (response.ok) {
        alert(`Data for ${stateType} submitted successfully!`);
        setSubmittedStates(prev => ({
          ...prev,
          [stateType]: true
        }));
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.error}`);
      }
    } catch (error) {
      console.error('Error submitting form data:', error);
      alert('Failed to save data');
    }
  
    setSelectedAudio(null);
  };

  const handleInputChange = (stateType, field, value) => {
    setFormData({
      ...formData,
      [stateType]: {
        ...formData[stateType],
        [field]: value
      }
    });
  };

  const convertToJSONL = (stateType) => {
    const dataObject = {
      stateType,
      data: formData[stateType]
    };
    return JSON.stringify(dataObject) + "\n";
  };

  const allFormsSubmitted = Object.values(submittedStates).every(Boolean);

  return (
    <div>
      <Navbar />
      <div className="calibration-page">
        <h1>Initial Calibration</h1>
        <h2>Introductory audio</h2>
        <AudioPlayer src="../Introduction.mp3" controls/>
        <p>Listen to each audio and answer the questions to calibrate your nervous system states.</p>

        {/* Audio Selection Buttons */}
        <div className="audio-buttons">
          {Object.keys(audioSources).map((audioType) => (
            <button key={audioType} onClick={() => setSelectedAudio(audioType)}>
              {audioType.charAt(0).toUpperCase() + audioType.slice(1)} Audio
            </button>
          ))}
        </div>

        {/* Audio Player and Form */}
        {selectedAudio && (
          <div className="audio-section">
            <h2>{selectedAudio.charAt(0).toUpperCase() + selectedAudio.slice(1)} State</h2>
            <AudioPlayer src={audioSources[selectedAudio]} controls />
            <form onSubmit={(e) => handleFormSubmit(selectedAudio, e)}>
              {["colors", "imagery", "sensations", "emotions", "actions", "memories", "identity", "world"].map((field) => (
                <label key={field}>
                  {field === "identity" || field === "world"
                    ? `Fill in the blank: "${field === "identity" ? "I am" : "The world is"} ____"`
                    : `What ${field} help represent this state?`}
                  <input
                    type="text"
                    value={formData[selectedAudio][field] || ""}
                    onChange={(e) => handleInputChange(selectedAudio, field, e.target.value)}
                    required={true}
                  />
                </label>
              ))}
              <button type="submit">Submit {selectedAudio} Data</button>
            </form>
          </div>
        )}
        {allFormsSubmitted && !thankYouPlayed && (
          <div className="thank-you-audio">
            <h2>Thank You!</h2>
            <AudioPlayer src="../Thankyou.mp3" autoPlay onEnded={() => setThankYouPlayed(true)} controls/>
          </div>
        )}
      </div>
    </div>
  );
};

export default CalibrationPage;
