import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { UserProvider } from "./context/UserContext";
import { SignupProvider } from "./context/SignupContext";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <UserProvider>
      <SignupProvider>
        <App />
      </SignupProvider>
    </UserProvider>
  </StrictMode>,
)
