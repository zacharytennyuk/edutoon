import { useNavigate, useLocation } from 'react-router-dom';

export default function DisplayPage({history}) {
    
  const navigate = useNavigate();

  const loc = useLocation();
  const panelURL = loc.state?.panelURL;
  const generatedPrompt = loc.state?.generatedPrompt;
  const generatedSummary = loc.state?.generatedSummary;

  return (
    <div>
      <h3>Thank you for using EduToon. Here is your comic. Enjoy!</h3>
      <p>AI-Generated Prompt: {generatedPrompt || 'PROMPT MISSING!'}</p>
      {panelURL ? (
        <img src={panelURL} width="750" height="auto" alt="Generated comic panel"/>
      ) : (
        <p>PANEL MISSING!</p>
      )}
      <p>AI-Generated Summary: {generatedSummary || 'SUMMARY MISSING!'}</p>
      <br />
      <button onClick={() => navigate('/')}>Restart</button>
    </div>
  );
}