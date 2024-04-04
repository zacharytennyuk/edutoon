import { useNavigate, useLocation } from 'react-router-dom';

export default function DisplayPage({history}) {
    
  const navigate = useNavigate();

  const loc = useLocation();
  const panelURL = loc.state?.panelURL;
  const generatedPrompt = loc.state?.generatedPrompt;
  const generatedSummary = loc.state?.generatedSummary;

  return (
    <div className="DisplayPage">
      <p className="title">Thank you for using EduToon. Here is your comic. Enjoy!</p>
      <p className="text">AI-Generated Prompt: {generatedPrompt || 'PROMPT MISSING!'}</p>
      {panelURL ? (
        <img src={panelURL} width="750" height="auto" alt="Generated comic panel"/>
      ) : (
        <p className="text">AI-Generated Panel: PANEL MISSING!</p>
      )}
      <p className="text">AI-Generated Summary: {generatedSummary || 'SUMMARY MISSING!'}</p>
      <br />
      <button className="btn" onClick={() => navigate('/')}>Restart</button>
    </div>
  );
}