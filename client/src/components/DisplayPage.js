import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react'
import axios from 'axios';

function DisplayPage({history}) {
    
  const navigate = useNavigate();
  //const [panelPrompt, setPanelPrompt] = useState('A cute mandarin duck!');
  const[panelURL, setPanelURL] = useState("");

  useEffect(() => {
    const fetchPanel = async () => {
      try {

        const panel = await axios.post("http://localhost:5200/create-panel");
        //console.log(panelURL);
        setPanelURL(panel.data.panelURL);
        //setPanelURL(panel.data[0].url);
      } catch (error) {
        console.error("Error fetching panel: ", error);
      }
    }
    fetchPanel();
  }, []);

  return (
    <div>
      <h3>Thank you for using EduToon. Here is your comic. Enjoy!</h3>
      {panelURL && <img src={panelURL} width="750" height="auto" alt="Generated comic panel"/>}
      <br />
      <button onClick={() => navigate('/')}>Restart</button>
    </div>
  );
}

export default DisplayPage;
