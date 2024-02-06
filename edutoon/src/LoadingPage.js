import React from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function LoadingPage({ history }) {
    
    const navigate = useNavigate();
    useEffect(() => {
      const timer = setTimeout(() => {
        navigate('/display');
      }, 2500);
      return () => clearTimeout(timer);
    }, [navigate]);
    
    return (
      <div className="LoadingPage">
        <h3>Loading...</h3>
      </div>
    );
  }
  
  export default LoadingPage;