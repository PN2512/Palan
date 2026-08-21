import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'; // 1. Import the Router
import { GoogleOAuthProvider } from '@react-oauth/google'; // 2. Import Google Provider


console.log("My Client ID is:", import.meta.env.VITE_GOOGLE_CLIENT_ID); 
createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* 3. Wrap everything in the Google Provider */}
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID || "fallback"}>
      {/* 4. Wrap the App in the Browser Router */}
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </GoogleOAuthProvider>
  </StrictMode>,
)