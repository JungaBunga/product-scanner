import React, { createContext, useState, useContext } from 'react'

// Create context
const ScanContext = createContext(null)

/**
 * Custom hook to use the scan context
 * @returns {Object} Scan context values and methods
 */
export const useScanContext = () => {
  const context = useContext(ScanContext)
  if (!context) {
    throw new Error('useScanContext must be used within a ScanProvider')
  }
  return context
}

/**
 * Provider component for scan data
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 */
export const ScanProvider = ({ children }) => {
  // State for current scan result
  const [scanResult, setScanResult] = useState(null)
  
  // State for scan history
  const [scanHistory, setScanHistory] = useState([])

  /**
   * Add a scan result to history
   * @param {Object} result - Scan result to add
   */
  const addToHistory = (result) => {
    setScanHistory((prev) => [
      { 
        id: Date.now(), 
        data: result, 
        timestamp: new Date() 
      },
      ...prev,
    ])
  }

  /**
   * Clear the current scan result
   */
  const clearScanResult = () => {
    setScanResult(null)
  }

  /**
   * Clear scan history
   */
  const clearScanHistory = () => {
    setScanHistory([])
  }

  // Context value
  const value = {
    scanResult,
    setScanResult,
    scanHistory,
    addToHistory,
    clearScanResult,
    clearScanHistory
  }

  return (
    <ScanContext.Provider value={value}>
      {children}
    </ScanContext.Provider>
  )
}

export default ScanContext