import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import HekademosApp from './HekademosApp'
import { ExerciseProvider } from './context/exerciseStore'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <ExerciseProvider>
    <BrowserRouter>
      <StrictMode>
        <HekademosApp />
      </StrictMode>
    </BrowserRouter>
  </ExerciseProvider>
)
