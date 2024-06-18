import React, {useState} from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function HomePage({history}) {
    
    
    const navigate = useNavigate();
    const [abstract, setAbstract] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);

    const generation = async (event) => {
        event.preventDefault();
        setIsGenerating(true);
        try {
            const panel = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/create-panel`, {abstract});

            navigate('/display', {
                state: { 
                    generatedPrompt: panel.data.generatedPrompt,
                    generatedImage: panel.data.generatedImage,
                    generatedSummary: panel.data.generatedSummary,
                }
            });
        } catch (error) {
            console.error("Error fetching panel:", error);
            alert("The content you entered may not be a research abstract. Please try again.");
        } finally {
            setIsGenerating(false);
        }
    }
    
  return <div className="Page">
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
    
    {isGenerating ? (
        <>
            <p className="text">Attempting to arrange pixels...</p>
            <p className="text">Abstract: {abstract}</p>
        </>
    ) : (
        <form onSubmit = {generation}>
            <textarea className="textbox"
                style={{ width: '90vw', height: '45vh', fontFamily: 'inherit' }}
                value={abstract}
                onChange={(e) => setAbstract(e.target.value)}
                placeholder="Paste abstract here!"
                required
            />
            <button className="btn" type="submit">Generate</button>
        </form>
    )}
  </div>
}