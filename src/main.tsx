// src/main.tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from '@/App'
import { ThemeProvider } from '@/components/theme-provider'
import './styles/globals.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider defaultTheme="dark" storageKey="portal-escolar-theme">
      <App />
    </ThemeProvider>
  </StrictMode>,
)