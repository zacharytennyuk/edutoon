import React, {useState} from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function HomePage({history}) {
    
    
    const navigate = useNavigate();
    const [abstract, setAbstract] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    //const [generatedPrompt, setgeneratedPrompt] = useState('');

    const generation = async (event) => {
        event.preventDefault();
        setIsGenerating(true);
        try {
            const panel = await axios.post("http://localhost:5200/create-panel", {abstract});
            navigate('/display', {
                state: { 
                    generatedPrompt: panel.data.generatedPrompt,
                    panelURL: panel.data.panelURL
                }
            });
        } catch (error) {
            console.error("Error fetching panel:", error);
            alert("Failed to generate panel, sorry :(");
        } finally {
            setIsGenerating(false);
        }
    }
    
    // useEffect(() => {
    //     const fetchData = async () => {
    //         const result = await fetch('http://localhost:3001/abstract');
    //         const .jsonResult = await result.json();
    //         setAbstract(abstractResult);
    //     }

    //     fetchData();
    // }, [])
  return <div className="HomePage">
    <h3>EduToon: Making academic research more accessible.</h3>
    <h4>Welcome to EduToon! This tool uses generative AI to turn research papers into informational comics.
        Please paste the abstract you want to turn into a comic.
    </h4>
    <ul>
        <li>Paste an abstract.</li>
        <li>Generative AI will summarize it.</li>
        <li>Enjoy the comic!</li>
    </ul>
    

    
    {isGenerating ? (
        <>
            <p>Attempting to arrange pixels...</p>
            <p>Abstract: {abstract}</p>
        </>
    ) : (
        <form onSubmit = {generation}>
            <textarea
                value={abstract}
                onChange={(e) => setAbstract(e.target.value)}
                placeholder="Paste abstract here!"
                required
            />
            <br />
            <button type="submit">Generate</button>
        </form>
    )}
    
        {/* <form action="index.html" method="GET">
        <p>Add Research PDF</p>
        <input type="file" id="myFile" name="filename"/>
    </form>
    
    <form action="index.html" method="GET">
        <p>Number of Panels</p>
        <input type="number" id="panelnumbers" name="numbers"/>
    </form> */}
    {/* 
    <form action="index.html" method="GET">
        <p>Paste Section Here</p>
        <input type="text" id="abstract" name="texts"/>
    </form>
    <button onClick={() => navigate('/loading')}>Create</button> */}
    
  </div>
}