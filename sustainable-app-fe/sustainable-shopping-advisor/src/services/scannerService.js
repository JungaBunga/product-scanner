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
   * Check if scanned content is an email
   * @param {string} code - Scanned code content
   * @returns {boolean} Whether the code is an email
   */
  export const isEmail = (code) => {
    if (!code) return false
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(code)
  }
  
  /**
   * Check if scanned content is a phone number
   * @param {string} code - Scanned code content
   * @returns {boolean} Whether the code is a phone number
   */
  export const isPhoneNumber = (code) => {
    if (!code) return false
    return /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/.test(code)
  }
  
  /**
   * Process scan result to determine type and format
   * @param {Object} result - Raw scan result
   * @returns {Object} Processed scan result with type
   */
  export const processScanResult = (result) => {
    if (!result) return null
    
    let type = 'text'
    
    if (isUrl(result.code)) {
      type = 'url'
    } else if (isEmail(result.code)) {
      type = 'email'
    } else if (isPhoneNumber(result.code)) {
      type = 'phone'
    }
    
    return {
      ...result,
      type
    }
  }
  
  /**
   * Store scan in local storage
   * @param {Object} scan - Scan to store
   */
  export const storeScan = (scan) => {
    if (!scan) return
    
    // Get existing scans
    const existingScans = JSON.parse(localStorage.getItem('scanHistory') || '[]')
    
    // Add new scan to beginning of array
    const newScans = [
      {
        id: Date.now(),
        ...scan,
        timestamp: new Date().toISOString()
      },
      ...existingScans
    ]
    
    // Store back in localStorage (limit to 100 most recent scans)
    localStorage.setItem('scanHistory', JSON.stringify(newScans.slice(0, 100)))
  }
  
  /**
   * Get scans from local storage
   * @returns {Array} Array of stored scans
   */
  export const getStoredScans = () => {
    return JSON.parse(localStorage.getItem('scanHistory') || '[]')
  }
  
  /**
   * Clear scan history from local storage
   */
  export const clearStoredScans = () => {
    localStorage.removeItem('scanHistory')
  }