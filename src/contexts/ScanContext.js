import React, { createContext, useContext, useState, useEffect } from 'react';

// Create context
const ScanContext = createContext();

/**
 * Provider component for scan-related state
 */
export const ScanProvider = ({ children }) => {
  // State for current scan result
  const [scanResult, setScanResult] = useState(null);
  
  // State for scan history
  const [scanHistory, setScanHistory] = useState([]);
  
  // State for product data
  const [productData, setProductData] = useState(null);
  
  // State for sustainability analysis
  const [sustainabilityData, setSustainabilityData] = useState(null);
  
  // Load scan history from local storage on mount
  useEffect(() => {
    try {
      const savedHistory = localStorage.getItem('scanHistory');
      if (savedHistory) {
        setScanHistory(JSON.parse(savedHistory));
      }
    } catch (error) {
      console.error('Error loading scan history:', error);
    }
  }, []);
  
  // Save scan history to local storage when it changes
  useEffect(() => {
    try {
      localStorage.setItem('scanHistory', JSON.stringify(scanHistory));
    } catch (error) {
      console.error('Error saving scan history:', error);
    }
  }, [scanHistory]);
  
  // Add a scan to history
  const addToHistory = (result) => {
    setScanHistory(prevHistory => {
      // Add to beginning of array, limit to most recent 50
      const updatedHistory = [result, ...prevHistory].slice(0, 50);
      return updatedHistory;
    });
  };
  
  // Clear current scan result
  const clearScanResult = () => {
    setScanResult(null);
    setProductData(null);
    setSustainabilityData(null);
  };
  
  // Clear scan history
  const clearHistory = () => {
    setScanHistory([]);
  };
  
  // Context value
  const contextValue = {
    scanResult,
    setScanResult,
    productData,
    setProductData,
    sustainabilityData,
    setSustainabilityData,
    scanHistory,
    addToHistory,
    clearScanResult,
    clearHistory
  };
  
  // Log the context value to make sure everything is defined properly
  useEffect(() => {
    console.log('ScanContext initialized with:', {
      hasScanResult: scanResult !== null,
      hasProductData: productData !== null,
      hasSustainabilityData: sustainabilityData !== null,
      historyCount: scanHistory.length,
      settersExist: {
        setScanResult: typeof setScanResult === 'function',
        setProductData: typeof setProductData === 'function',
        setSustainabilityData: typeof setSustainabilityData === 'function',
      }
    });
  }, [scanResult, productData, sustainabilityData, scanHistory]);

  return (
    <ScanContext.Provider value={contextValue}>
      {children}
    </ScanContext.Provider>
  );
};

// Custom hook for using the scan context
export const useScanContext = () => {
  const context = useContext(ScanContext);
  
  if (context === undefined) {
    throw new Error('useScanContext must be used within a ScanProvider');
  }
  
  return context;
};