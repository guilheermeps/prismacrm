
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { initializeStorageBuckets } from './lib/supabase/utils/createBucket.ts'

// Initialize storage buckets
initializeStorageBuckets().catch(console.error);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
