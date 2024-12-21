import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from "./App";
import LogRocket from 'logrocket';

if(import.meta.env.VITE_APP_MODE_ON === "production"){
  LogRocket.init('ko7uwn/flowmate');
}

createRoot(document.getElementById('root')).render(

  <StrictMode>
    <App />
  </StrictMode>

)
