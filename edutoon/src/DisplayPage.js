import React from 'react';
import { useNavigate } from 'react-router-dom';

function DisplayPage({history}) {
    const navigate = useNavigate();
    return (
      <div>
        <button onClick={() => navigate('/')}>Restart</button>
      </div>
    );
}

export default DisplayPage;
