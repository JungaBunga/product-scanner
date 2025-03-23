/**
 * Utility functions for validating data
 */

/**
 * Check if a string is a valid URL
 * @param {string} str - String to check
 * @returns {boolean} Whether the string is a valid URL
 */
export const isValidUrl = (str) => {
    if (!str) return false
    
    try {
      const url = new URL(str)
      return url.protocol === 'http:' || url.protocol === 'https:'
    } catch {
      return false
    }
  }
  
  /**
   * Check if a string is a valid email
   * @param {string} str - String to check
   * @returns {boolean} Whether the string is a valid email
   */
  export const isValidEmail = (str) => {
    if (!str) return false
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(str)
  }
  
  /**
   * Check if a string is a valid phone number
   * @param {string} str - String to check
   * @returns {boolean} Whether the string is a valid phone number
   */
  export const isValidPhone = (str) => {
    if (!str) return false
    
    // Basic phone validation - adjust based on your requirements
    const phoneRegex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/
    return phoneRegex.test(str)
  }
  
  /**
   * Detect the type of content in a scanned code
   * @param {string} code - Scanned code content
   * @returns {string} Content type
   */
  export const detectContentType = (code) => {
    if (!code) return 'text'
    
    if (isValidUrl(code)) {
      return 'url'
    }
    
    if (isValidEmail(code)) {
      return 'email'
    }
    
    if (isValidPhone(code)) {
      return 'phone'
    }
    
    // Check if it's a vCard
    if (code.startsWith('BEGIN:VCARD') && code.includes('END:VCARD')) {
      return 'vcard'
    }
    
    // Check if it's a WiFi config
    if (code.startsWith('WIFI:') && code.includes('WIFI:S:')) {
      return 'wifi'
    }
    
    return 'text'
  }