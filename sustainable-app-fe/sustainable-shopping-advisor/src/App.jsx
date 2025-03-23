import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

// Import pages
import Home from './pages/Home'
import Scanner from './pages/Scanner'
import Results from './pages/Results'
import NotFound from './pages/NotFound'

// Import context provider
import { ScanProvider } from './contexts/ScanContext'

function App() {
  return (
    <ScanProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/scan" element={<Scanner />} />
          <Route path="/results" element={<Results />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </ScanProvider>
  )
}

export default App