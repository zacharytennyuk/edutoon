import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import html2canvas from 'html2canvas';
import P5Canvas from './P5Canvas';

export default function DisplayPage() {
  const navigate = useNavigate();
  const loc = useLocation();
  const { script, characterImagePath, backgroundImages } = loc.state;

  const [combinedImages, setCombinedImages] = useState([]);

  const handleImageComplete = (newImage, index) => {
    setCombinedImages((prev) => {
      const updated = [...prev];
      updated[index] = newImage;
      return updated;
    });
  };

  const captureImage = () => {
    const comicElement = document.getElementById('comic-wrapper');
    html2canvas(comicElement, { useCORS: true, scale: 2 }).then((canvas) => {
      const link = document.createElement('a');
      link.download = 'comic.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    });
  };

  const minLength = Math.min(script.length, backgroundImages.length); // Determine the minimum length
  const gridTemplateColumns = minLength === 2 || minLength === 4 ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)'; // Adjust grid for 4 panels

  return (
    <div className="Page">
      <p className="title">Thank you for using EduToon. Here is your comic. Enjoy!</p>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          alignItems: 'center',
          padding: '40px',
      }}
      >
      <div
        id="comic-wrapper"
        style={{
          backgroundColor: 'white',
          padding: '20px',
          display: 'inline-block',
          margin: '0 auto',
          // width: '100%',
        }}
      >
        <div
          id="comic"
          className="grid-container"
          style={{
            display: 'grid',
            gridTemplateColumns: gridTemplateColumns, // Adjust grid columns dynamically
            gap: '20px',
            maxWidth: '1024px',
            margin: '0 auto',
          }}
        >
          {Array.from({ length: minLength }).map((_, index) => (
            <div
              key={index}
              className="panel-container"
              style={{
                border: '5px solid black',
                backgroundColor: 'white',
              }}
            >
              <div
                className="grid-item"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  position: 'relative',
                  width: '100%',
                }}
              >
                {combinedImages[index] ? (
                  <>
                    <img
                      src={combinedImages[index]}
                      alt={`Panel ${index + 1}`}
                      style={{ width: '100%', height: 'auto' }}
                    />
                    <div
                      className="text"
                      style={{
                        width: '100%',
                        height: '100%',
                        overflow: 'hidden',
                        textAlign: 'justify',
                        color: 'black',
                        fontSize: '10px',
                        background: 'white',
                        padding: '10px',
                        top: '10px',
                      }}
                      dangerouslySetInnerHTML={{
                        __html: script[index]?.replace(/\n/g, '<br />'),
                      }}
                    ></div>
                  </>
                ) : (
                  <P5Canvas
                    imageUrl={backgroundImages[index]}
                    characterImageUrl={`${process.env.REACT_APP_BACKEND_URL}/image/${characterImagePath}`}
                    onComplete={(newImage) => handleImageComplete(newImage, index)}
                  />
                )}
              </div>
            </div>
          ))}
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '12px',
            marginTop: '10px',
            marginBottom: '10px',
            color: 'gray',
          }}
        >
          <span>This image was AI-generated.</span>
          <span>https://github.com/zacharytennyuk/edutoon</span>
        </div>
      </div>
        <div className="text-container" style={{ marginTop: '20px' }}>
          <button className="btn" onClick={captureImage}>
            Download Comic as PNG
          </button>
          <button className="btn" onClick={() => navigate('/')}>
            Restart
          </button>
        </div>
      </div>
    </div>
  );
}
