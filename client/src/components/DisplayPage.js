import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import P5Canvas from './P5Canvas';

export default function DisplayPage() {
  const navigate = useNavigate();
  const loc = useLocation();
  const generatedImage = loc.state?.generatedImage;
  const generatedPrompt = loc.state?.generatedPrompt;
  const generatedSummary = loc.state?.generatedSummary;

  const [useP5Canvas, setUseP5Canvas] = useState(true);
  const [currentQuadrant, setCurrentQuadrant] = useState(1);

  const handleCycleQuadrant = () => {
    setCurrentQuadrant(prev => (prev % 4) + 1);
  };

  const getQuadrantStyle = () => {
    const quadrantPositions = [
      { transform: 'translate(0, 0)' },          // Quadrant 1: Top-left
      { transform: 'translate(-1024px, 0)' },    // Quadrant 2: Top-right
      { transform: 'translate(0, -1024px)' },    // Quadrant 3: Bottom-left
      { transform: 'translate(-1024px, -1024px)' } // Quadrant 4: Bottom-right
    ];

    return quadrantPositions[currentQuadrant - 1];
  };

  console.log("AI-Generated Prompt:", generatedPrompt);

  return (
    <div className="Page">
      <p className="title">Thank you for using EduToon. Here is your comic. Enjoy!</p>
      <div className="columns">
        <div className="image-container">
          {generatedImage ? (
            useP5Canvas ? (
              <P5Canvas 
                imageUrl={generatedImage} 
                summary={generatedSummary} 
                quadrant={currentQuadrant}
                characterImageUrl="/output.png"  // Ensure the correct path
              />
            ) : (
              <div style={{ width: '1024px', height: '1024px' }}>
                <img
                  src={generatedImage}
                  alt="Generated comic panel"
                  style={{
                    width: '1024px',
                    height: '1024px',
                    position: 'absolute',
                    ...getQuadrantStyle(),
                  }}
                />
                <p className="text">{generatedSummary || 'SUMMARY MISSING!'}</p>
              </div>
            )
          ) : (
            <p className="text">PANEL MISSING!</p>
          )}
          <br />
          <button className="btn" onClick={() => navigate('/')}>Restart</button>
        </div>
        <div className="text-container">
          <button className="btn" onClick={() => setUseP5Canvas(!useP5Canvas)}>
            {useP5Canvas ? 'Switch to Image View' : 'Switch to P5.js View'}
          </button>
          <button className="btn" onClick={handleCycleQuadrant}>
            Image Option {currentQuadrant}
          </button>
        </div>
      </div>
    </div>
  );
}
