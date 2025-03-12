import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

// Add a visible indicator that the app is in offline mode
document.addEventListener('DOMContentLoaded', () => {
  // This helps users confirm the app is running in offline mode
  window.addEventListener('online', () => {
    console.log('Network connection detected. For maximum security, consider disconnecting from the internet.');
  });
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
