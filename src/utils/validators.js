/**
 * Utility functions for validating data
 */

/**
 * Check if a string is a valid URL
 * @param {string} text - String to check
 * @returns {boolean} Whether the string is a valid URL
 */
export const isValidUrl = (text) => {
    if (!text) return false
    
    try {
      const url = new URL(text)
      return url.protocol === 'http:' || url.protocol === 'https:'
    } catch (error) {
      return false
    }
  }
  
  /**
   * Check if a string is a valid email
   * @param {string} text - String to check
   * @returns {boolean} Whether the string is a valid email
   */
  export const isValidEmail = (text) => {
    if (!text) return false
    
    // Basic email regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(text)
  }
  
  /**
   * Check if a string is a valid phone number
   * @param {string} text - String to check
   * @returns {boolean} Whether the string is a valid phone number
   */
  export const isValidPhone = (text) => {
    if (!text) return false
    
    // Basic phone regex - various formats accepted
    const phoneRegex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/
    return phoneRegex.test(text)
  }
  
  /**
   * Check if a string starts with a specific protocol
   * @param {string} text - String to check
   * @param {string} protocol - Protocol to check for
   * @returns {boolean} Whether the string starts with the protocol
   */
  export const startsWithProtocol = (text, protocol) => {
    if (!text || !protocol) return false
    
    return text.toLowerCase().startsWith(protocol.toLowerCase())
  }
  
  /**
   * Validate a scan result
   * @param {Object} result - Scan result to validate
   * @returns {boolean} Whether the scan result is valid
   */
  export const isValidScanResult = (result) => {
    if (!result) return false
    
    // Must have code property
    if (!result.code) return false
    
    // Code must be a string
    if (typeof result.code !== 'string') return false
    
    // Code must not be empty
    if (result.code.trim() === '') return false
    
    return true
  }