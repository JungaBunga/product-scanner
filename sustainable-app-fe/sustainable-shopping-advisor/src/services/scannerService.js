/**
 * Scanner service for handling scan data operations
 */

/**
 * Check if scanned content is a URL
 * @param {string} code - Scanned code content
 * @returns {boolean} Whether the code is a URL
 */
export const isUrl = (code) => {
    if (!code) return false
    return /^(http|https):\/\/[^ "]+$/.test(code)
  }
  
  /**
   * Format scan timestamp
   * @param {Date|string} timestamp - Timestamp to format
   * @returns {string} Formatted timestamp
   */
  export const formatTimestamp = (timestamp) => {
    if (!timestamp) return ''
    const date = timestamp instanceof Date ? timestamp : new Date(timestamp)
    return date.toLocaleString()
  }
  
  /**
   * Process raw scan result
   * @param {Object} result - Raw scan result from scanner
   * @returns {Object} Processed scan data
   */
  export const processScanResult = (result) => {
    if (!result) return null
    
    return {
      code: result.code,
      format: result.format,
      timestamp: result.timestamp || new Date(),
      isUrl: isUrl(result.code)
    }
  }
  
  /**
   * Store scan in local storage
   * @param {Object} scan - Scan data to store
   */
  export const storeScan = (scan) => {
    try {
      const storedScans = getStoredScans()
      const updatedScans = [
        {
          id: Date.now(),
          data: scan,
          timestamp: new Date()
        },
        ...storedScans
      ]
      
      localStorage.setItem('scanHistory', JSON.stringify(updatedScans))
      return true
    } catch (error) {
      console.error('Error storing scan', error)
      return false
    }
  }
  
  /**
   * Get scans from local storage
   * @returns {Array} Stored scans
   */
  export const getStoredScans = () => {
    try {
      const scans = localStorage.getItem('scanHistory')
      return scans ? JSON.parse(scans) : []
    } catch (error) {
      console.error('Error retrieving scans', error)
      return []
    }
  }
  
  /**
   * Clear scan history from local storage
   */
  export const clearStoredScans = () => {
    try {
      localStorage.removeItem('scanHistory')
      return true
    } catch (error) {
      console.error('Error clearing scans', error)
      return false
    }
  }