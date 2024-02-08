import React from 'react';
import { useNavigate } from 'react-router-dom';

function DisplayPage({history}) {
    const navigate = useNavigate();
    
    return (
      <div>
        <h3>Thank you for using EduToon. Here is your comic. Enjoy!</h3>
        <img src="https://cdn.pixabay.com/photo/2014/11/16/23/16/upset-534103_1280.jpg"
        width="640"
        height="480"
        alt="Generated comic panel (placeholder)" 
        />
        <br></br>
        <button onClick={() => navigate('/')}>Restart</button>
      </div>
    );
    
}

export default DisplayPage;
