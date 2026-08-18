import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { MotionConfig } from 'framer-motion'

import App from './App'
import { SurveyProvider } from './app/SurveyProvider'
import './index.css'

const root = document.getElementById('root')

if (!root) {
  throw new Error('Root element was not found')
}

createRoot(root).render(
  <StrictMode>
    <SurveyProvider>
      <MotionConfig
        reducedMotion="user"
        transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
      >
        <App />
      </MotionConfig>
    </SurveyProvider>
  </StrictMode>,
)
