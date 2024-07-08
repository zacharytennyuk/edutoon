import { useNavigate, useLocation } from 'react-router-dom';

export default function DisplayPage({history}) {
    
  const navigate = useNavigate();

  const loc = useLocation();
  const generatedImage = loc.state?.generatedImage;
  const generatedPrompt = loc.state?.generatedPrompt;
  const generatedSummary = loc.state?.generatedSummary;

  console.log("AI-Generated Prompt:", generatedPrompt);

  return (
    <div className="Page">
      
      <p className="title">Thank you for using EduToon. Here is your comic. Enjoy!</p>
      {/* <p className="text">AI-Generated Prompt: {generatedPrompt || 'PROMPT MISSING!'}</p> */}
      <div className="columns">
        <div className="image-container">
          {generatedImage ? (
          <img src={generatedImage} alt="Generated comic panel"/>
          ) : (
            <p className="text">PANEL MISSING!</p>
          )}
          <br/>
          <button className="btn" onClick={() => navigate('/')}>Restart</button>
        </div>
        <div className="text-container">
          <p className="text dialogue">{generatedSummary || 'SUMMARY MISSING!'}</p>
        </div>
      </div>
      
    </div>
  );
}