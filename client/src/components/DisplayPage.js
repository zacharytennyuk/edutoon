import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import P5Canvas from './P5Canvas';

export default function DisplayPage() {
  const navigate = useNavigate();
  const loc = useLocation();
  const { script, characterImagePath, backgroundImages } = loc.state;

  const [useP5Canvas, setUseP5Canvas] = useState(true);
  const [currentQuadrant, setCurrentQuadrant] = useState(1);

  const handleCycleQuadrant = () => {
    setCurrentQuadrant(prev => (prev % 4) + 1);
  };

  const getQuadrantStyle = () => {
    const quadrantPositions = [
      { transform: 'translate(0, 0)' },
      { transform: 'translate(-1024px, 0)' },
      { transform: 'translate(0, -1024px)' },
      { transform: 'translate(-1024px, -1024px)' }
    ];

    return quadrantPositions[currentQuadrant - 1];
  };

  return (
    <div className="Page">
      <p className="title">Thank you for using EduToon. Here is your comic. Enjoy!</p>
      <div className="columns">
        {script.map((dialogue, index) => (
          <div key={index} className="image-container" style={{ position: 'relative', marginBottom: '20px' }}>
            {useP5Canvas ? (
              <P5Canvas 
                imageUrl={backgroundImages[index]} 
                summary={dialogue} 
                quadrant={currentQuadrant}
                characterImageUrl={`${process.env.REACT_APP_BACKEND_URL}/image/${characterImagePath}`} // Construct URL correctly
              />
            ) : (
              <div style={{ width: '1024px', height: '1024px' }}>
                <img
                  src={backgroundImages[index]}
                  alt={`Panel ${index + 1}`}
                  style={{
                    width: '1024px',
                    height: '1024px',
                    position: 'absolute',
                    ...getQuadrantStyle(),
                  }}
                />
                <img
                  src={`${process.env.REACT_APP_BACKEND_URL}/image/${characterImagePath}`} // Construct URL correctly
                  alt="Characters"
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '1024px',
                    height: '1024px'
                  }}
                />
                <p className="text" style={{ position: 'absolute', bottom: '10px', left: '10px', color: 'white', background: 'rgba(0, 0, 0, 0.5)', padding: '5px' }}>
                  {dialogue}
                </p>
              </div>
            )}
            <br />
            <button className="btn" onClick={() => navigate('/')}>Restart</button>
          </div>
        ))}
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
