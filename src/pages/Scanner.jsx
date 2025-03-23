import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useScanContext } from '../contexts/ScanContext'
import { processScanResult } from '../services/scannerService'
import Header from '../components/Scanner/Layout/Header'
import Footer from '../components/Scanner/Layout/Footer'
import ScannerView from '../components/Scanner/ScannerView'

/**
 * Scanner page component
 * @returns {JSX.Element} Scanner page
 */
const Scanner = () => {
  const navigate = useNavigate()
  const { setScanResult, addToHistory } = useScanContext()
  const [error, setError] = useState(null)
  const [mountScanner, setMountScanner] = useState(true)
  
  // Handle successful scan
  const handleScanSuccess = (result) => {
    if (!result || !result.code) return
    
    try {
      // Unmount scanner to prevent further scanning
      setMountScanner(false)
      
      // Process the scan result
      const processedResult = processScanResult(result.code)
      
      // Update context
      setScanResult(processedResult)
      addToHistory(processedResult)
      
      // Small delay before navigation to ensure cleanup
      setTimeout(() => {
        navigate('/results')
      }, 100)
    } catch (err) {
      console.error('Error processing scan:', err)
      setError('Failed to process scan result')
    }
  }
  
  // Handle scan error
  const handleScanError = (err) => {
    console.error('Scanner error:', err)
    setError(typeof err === 'string' ? err : err.message || 'Scanner error occurred')
  }

  // Handle cancel button
  const handleCancel = () => {
    setMountScanner(false)
    setTimeout(() => {
      navigate('/')
    }, 100)
  }
  
  return (
    <div className="scanner-page container">
      <Header title="Scan Product Barcode" />
      
      <div className="scanner-content" style={{ padding: '0 1rem' }}>
        {mountScanner && (
          <ScannerView 
            onScanSuccess={handleScanSuccess}
            onScanError={handleScanError}
          />
        )}
        
        {error && (
          <div 
            className="error-message"
            style={{
              padding: '0.75rem',
              backgroundColor: '#fff5f5',
              color: '#c53030',
              borderRadius: '0.25rem',
              marginBottom: '1rem',
              fontSize: '0.875rem',
              textAlign: 'center'
            }}
          >
            {error}
          </div>
        )}
        
        <div className="button-container" style={{ marginTop: '1rem', textAlign: 'center' }}>
          <button 
            onClick={handleCancel}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#e2e8f0',
              borderRadius: '0.25rem',
              border: 'none',
              fontWeight: '500',
              cursor: 'pointer'
            }}
          >
            Cancel
          </button>
        </div>
      </div>
      
      <Footer />
    </div>
  )
}

export default Scanner