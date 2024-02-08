import React from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function LoadingPage({ history }) {
    
    const navigate = useNavigate();
    useEffect(() => {
      const timer = setTimeout(() => {
        navigate('/display');
      }, 500);
      return () => clearTimeout(timer);
    }, [navigate]);
    
    return (
      <div>
        <h1>Loading...</h1>
      </div>
    );
  }
  
  export default LoadingPage;