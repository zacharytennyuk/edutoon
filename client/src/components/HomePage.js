import React from 'react';
import { useNavigate } from 'react-router-dom';

function HomePage({history}) {
    const navigate = useNavigate();
  return <div className="HomePage">
  <h3>EduToon: Making academic research more accessible.</h3>
  <h4>Welcome to EduToon! This tool uses generative AI to turn research papers into informational comics.
      Please upload the paper you want to turn into a comic (.pdf or .docx).
  </h4>
  <ul>
      <li>Upload a research pdf.</li>
      <li>Generative AI will summarize it.</li>
      <li>Enjoy the comic!</li>
  </ul>
  
  <form action="index.html" method="GET">
      <p>Add Research PDF</p>
      <input type="file" id="myFile" name="filename"/>
      <input type="submit" value="Submit"/>
  </form>
  
  <form action="index.html" method="GET">
      <p>Number of Panels</p>
      <input type="number" id="panelnumbers" name="numbers"/>
      <input type="submit" value="Submit"/>
  </form>
  
  <form action="index.html" method="GET">
      <p>Comic Scenario</p>
      <input type="text" id="panelscene" name="texts"/>
      <input type="submit" value="Submit"/>
  </form>
  <button onClick={() => navigate('/loading')}>Create</button>
  </div>
}

export default HomePage;