import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import html2canvas from 'html2canvas'; // Corrected import

export default function DisplayPage() {
  const navigate = useNavigate();
  const loc = useLocation();
  const { script, characterImagePath, backgroundImages } = loc.state;

  const captureImage = () => {
    const comicElement = document.getElementById('comic');
    html2canvas(comicElement).then(canvas => {
      const link = document.createElement('a');
      link.download = 'comic.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    });
  };

  return (
    <div className="Page">
      <p className="title">Thank you for using EduToon. Here is your comic. Enjoy!</p>

      <div id="comic" className="grid-container">
        {script.map((dialogue, index) => (
          <div key={index} className="grid-item" style={{ position: 'relative' }}>
            <img
              src={backgroundImages[index]}
              alt={`Panel ${index + 1}`}
              style={{
                width: '100%',
                height: 'auto',
                position: 'relative',
              }}
            />
            <img
              src={`${process.env.REACT_APP_BACKEND_URL}/image/${characterImagePath}`}
              alt="Characters"
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
            <p className="text" style={{ position: 'absolute', bottom: '10px', left: '10px', color: 'white', background: 'rgba(0, 0, 0, 0.5)', padding: '5px' }}>
              {dialogue}
            </p>
          </div>
        ))}
      </div>

      <div className="text-container">
        <button className="btn" onClick={captureImage}>
          Download Comic as PNG
        </button>
        <button className="btn" onClick={() => navigate('/')}>
          Restart
        </button>
      </div>
    </div>
  );
}
