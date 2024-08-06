import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function HomePage() {
  const navigate = useNavigate();
  const [abstract, setAbstract] = useState('');
  const [pdf, setPdf] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [usePDF, setUsePDF] = useState(false);

  const handleTogglePDF = () => {
    setUsePDF(!usePDF);
  };

  const handlePdfChange = (event) => {
    setPdf(event.target.files[0]);
  };

  const generation = async (event) => {
    event.preventDefault();
    setIsGenerating(true);
    try {
      let panel;
      if (usePDF && pdf) {
        const formData = new FormData();
        formData.append('pdf', pdf);
        panel = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/upload-pdf`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
      } else {
        panel = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/process-paper`, { abstract });
      }

      navigate('/display', {
        state: {
          script: panel.data.script,
          characterBuffer: panel.data.characterBuffer,
          backgroundImages: panel.data.backgroundImages,
        }
      });
    } catch (error) {
      console.error("Error fetching panel:", error);
      alert("There was an error processing your request. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="Page">
      <p className="title">EduToon: Making academic research more accessible.</p>

      <p className="text">
        Welcome to EduToon! This tool uses generative AI to turn research papers into informational comics.
        Please paste the abstract you want to turn into a comic or upload a PDF file.
      </p>

      <ul className="list">
        <li>Paste an abstract or upload a PDF.</li>
        <li>Generative AI will summarize it.</li>
        <li>Enjoy the summary!</li>
      </ul>

      <label>
        <input type="checkbox" checked={usePDF} onChange={handleTogglePDF} />
        Use PDF
      </label>

      {isGenerating ? (
        <p className="text">Generating summary...</p>
      ) : (
        <form onSubmit={generation}>
          {usePDF ? (
            <input type="file" accept="application/pdf" onChange={handlePdfChange} required />
          ) : (
            <textarea
              className="textbox"
              style={{ width: '90vw', height: '45vh', fontFamily: 'inherit' }}
              value={abstract}
              onChange={(e) => setAbstract(e.target.value)}
              placeholder="Paste abstract here!"
              required
            />
          )}
          <button className="btn" type="submit">Generate</button>
        </form>
      )}
    </div>
  );
}
