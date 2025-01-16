import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
// import './css/styles.css'

// Get the root element
const rootElement = document.getElementById('root');

// Create the root and render the app
createRoot(rootElement).render(
  // <StrictMode>
    <App />
  // </StrictMode>
);