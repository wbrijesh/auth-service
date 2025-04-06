import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import "./tailwind.css"

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <div className="text-white">
      <App />
    </div>
  </StrictMode>,
)
