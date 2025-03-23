import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useScanContext } from '../contexts/ScanContext'
import { processScanResult } from '../services/scannerService'
import Header from '../components/Layout/Header'
import Footer from '../components/Layout/Footer'
import ScannerView from '../components/Scanner/ScannerView'

/**
 * Scanner page component
 * @returns {JSX.Element} Scanner page
 */
const Scanner = () => {
  const navigate = useNavigate()
  const { setScanResult, addToHistory } = useScanContext()
  const [error, setError] = useState(null)
  
  // Handle successful scan
  const handleScanSuccess = (result) => {
    if (!result) return
    
    // Process the scan result
    const processedResult = processScanResult(result)
    
    // Update context
    setScanResult(processedResult)
    addToHistory(processedResult)
    
    // Navigate to results page
    navigate('/results')
  }
  
  // Handle scan error
  const handleScanError = (err) => {
    setError(err)
  }
  
  return (
    <div className="container">
      <Header title="Scan QR Code" />
      
      <ScannerView 
        onScanSuccess={handleScanSuccess}
        onScanError={handleScanError}
      />
      
      {error && (
        <div 
          style={{
            padding: '0.5rem',
            backgroundColor: '#fff5f5',
            color: '#c53030',
            borderRadius: '0.25rem',
            marginBottom: '1rem',
            fontSize: '0.875rem'
          }}
        >
          {error}
        </div>
      )}
      
      <Footer />
    </div>
  )
}

export default Scanner