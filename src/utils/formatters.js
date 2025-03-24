/**
 * Utility functions for formatting data
 */

/**
 * Format timestamp to readable date/time
 * @param {string|Date} timestamp - Timestamp to format
 * @returns {string} Formatted timestamp
 */
export const formatTimestamp = (timestamp) => {
    if (!timestamp) return ''
    
    const date = timestamp instanceof Date ? timestamp : new Date(timestamp)
    
    return date.toLocaleString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }
  
  /**
   * Format QR code format name to be more readable
   * @param {string} format - QR code format
   * @returns {string} Formatted format name
   */
  export const formatQrFormat = (format) => {
    if (!format) return 'Unknown'
    
    // Handle common format names
    const formatMap = {
      'QR_CODE': 'QR Code',
      'CODE_128': 'Code 128',
      'CODE_39': 'Code 39',
      'UPC_A': 'UPC-A',
      'UPC_E': 'UPC-E',
      'EAN_8': 'EAN-8',
      'EAN_13': 'EAN-13',
      'PDF_417': 'PDF 417',
      'AZTEC': 'Aztec',
      'DATA_MATRIX': 'Data Matrix'
    }
    
    if (formatMap[format]) {
      return formatMap[format]
    }
    
    // For other formats, make them title case
    return format
      .replace(/_/g, ' ')
      .toLowerCase()
      .replace(/\b\w/g, l => l.toUpperCase())
  }
  
  /**
   * Truncate text with ellipsis if it exceeds max length
   * @param {string} text - Text to truncate
   * @param {number} maxLength - Maximum length
   * @returns {string} Truncated text
   */
  export const truncate = (text, maxLength = 50) => {
    if (!text) return ''
    if (text.length <= maxLength) return text
    
    return text.substring(0, maxLength) + '...'
  }
  
  /**
   * Format a scan type to readable text
   * @param {string} type - Scan type (url, email, phone, text)
   * @returns {string} Formatted type
   */
  export const formatScanType = (type) => {
    const typeMap = {
      'url': 'Website URL',
      'email': 'Email Address',
      'phone': 'Phone Number',
      'text': 'Text',
      'wifi': 'WiFi Network',
      'contact': 'Contact'
    }
    
    return typeMap[type] || 'Text'
  }