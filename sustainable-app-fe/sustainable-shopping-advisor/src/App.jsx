import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ChakraProvider, extendTheme } from '@chakra-ui/react'

// Import pages
import Home from './pages/Home'
import Scanner from './pages/Scanner'
import Results from './pages/Results'
import NotFound from './pages/NotFound'

// Import context provider
import { ScanProvider } from './contexts/ScanContext'

// Theme customization
const theme = extendTheme({
  colors: {
    brand: {
      50: '#e6f7ff',
      100: '#b3e0ff',
      500: '#0099ff',
      600: '#0077cc',
      700: '#005599',
    },
  },
  fonts: {
    heading: 'Poppins, sans-serif',
    body: 'Inter, sans-serif',
  },
})

function App() {
  return (
    <ChakraProvider theme={theme}>
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
    </ChakraProvider>
  )
}

export default App