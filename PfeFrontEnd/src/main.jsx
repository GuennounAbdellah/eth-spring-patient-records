import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

//  loading spinner styles
const style = document.createElement('style');
style.textContent = `
  .loading-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100vh;
  }
  
  .loading-spinner {
    border: 4px solid rgba(0, 0, 0, 0.1);
    width: 36px;
    height: 36px;
    border-radius: 50%;
    border-left-color: #3F8996;
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  .unauthorized-page {
    text-align: center;
    padding: 2rem;
    max-width: 600px;
    margin: 0 auto;
    margin-top: 100px;
  }
  
  .unauthorized-page h1 {
    color: #e74c3c;
    margin-bottom: 1rem;
  }
  
  .unauthorized-page button {
    background-color: #3F8996;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 4px;
    margin-top: 1rem;
    cursor: pointer;
  }
`;
document.head.appendChild(style);

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);