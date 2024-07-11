import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function HomePage() {
  const navigate = useNavigate();
  const [abstract, setAbstract] = useState('');
  const [image, setImage] = useState(null); // State to hold the image file
  const [isGenerating, setIsGenerating] = useState(false);
  const [useMidJourney, setUseMidJourney] = useState(false);

  const handleToggle = () => {
    setUseMidJourney(!useMidJourney);
  };

  const handleImageChange = (event) => {
    setImage(event.target.files[0]);
  };

  const generation = async (event) => {
    event.preventDefault();
    setIsGenerating(true);
    try {
      const endpoint = useMidJourney ? '/api/create-panel-midjourney' : '/api/create-panel';
      const formData = new FormData();
      formData.append('abstract', abstract);
      if (image) {
        formData.append('image', image);
      }

      const panel = await axios.post(`${process.env.REACT_APP_BACKEND_URL}${endpoint}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      navigate('/display', {
        state: {
          generatedPrompt: panel.data.generatedPrompt,
          generatedImage: panel.data.generatedImage,
          generatedSummary: panel.data.generatedSummary,
        }
      });
    } catch (error) {
      console.error("Error fetching panel:", error);
      if (error.response) {
        console.error("Error response data:", error.response.data);
        console.error("Error response status:", error.response.status);
        console.error("Error response headers:", error.response.headers);
      } else {
        console.error("Error message:", error.message);
      }
      alert("The content you entered may not be a research abstract. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="Page">
      <p className="title">
        EduToon: Making academic research more accessible.
      </p>

      <p className="text">
        Welcome to EduToon! This tool uses generative AI to turn research papers into informational comics.
        Please paste the abstract you want to turn into a comic.
      </p>

      <ul className="list">
        <li>Paste an abstract.</li>
        <li>Generative AI will summarize it.</li>
        <li>Enjoy the comic!</li>
      </ul>

      <label>
        <input type="checkbox" checked={useMidJourney} onChange={handleToggle} />
        Use MidJourney
      </label>

      {isGenerating ? (
        <>
          <p className="text">Attempting to arrange pixels...</p>
          <p className="text">Abstract: {abstract}</p>
        </>
      ) : (
        <form onSubmit={generation}>
          <textarea className="textbox"
            style={{ width: '90vw', height: '45vh', fontFamily: 'inherit' }}
            value={abstract}
            onChange={(e) => setAbstract(e.target.value)}
            placeholder="Paste abstract here!"
            required
          />
          <input type="file" onChange={handleImageChange} accept="image/*" />
          <button className="btn" type="submit">Generate</button>
        </form>
      )}
    </div>
  );
}
