import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import ReactGA from 'react-ga4';

// Initialize Google Analytics if user has consented
const consent = localStorage.getItem('analytics_consent');
if (consent === 'accepted') {
  ReactGA.initialize('G-C0HBWJFK1V');
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);