import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { useContext } from 'react'
import { ContextProvider, MyStore } from './components/context/MyContext.jsx'

createRoot(document.getElementById('root')).render(
  <ContextProvider><App></App></ContextProvider>

)
