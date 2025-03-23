/**
 * Utility functions for formatting data
 */

/**
 * Format a date to a localized string
 * @param {Date|string} date - Date to format
 * @param {Object} options - Intl.DateTimeFormat options
 * @returns {string} Formatted date string
 */
export const formatDate = (date, options = {}) => {
    if (!date) return ''
    
    const dateObj = date instanceof Date ? date : new Date(date)
    
    const defaultOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }
    
    return new Intl.DateTimeFormat(
      navigator.language || 'en-US',
      { ...defaultOptions, ...options }
    ).format(dateObj)
  }
  
  /**
   * Truncate a string with ellipsis
   * @param {string} str - String to truncate
   * @param {number} maxLength - Maximum length
   * @returns {string} Truncated string
   */
  export const truncateString = (str, maxLength = 30) => {
    if (!str) return ''
    if (str.length <= maxLength) return str
    return str.substring(0, maxLength) + '...'
  }
  
  /**
   * Format a scan format name to be more user-friendly
   * @param {string} format - Scan format (e.g., 'qr_code_reader')
   * @returns {string} Formatted scan format
   */
  export const formatScanType = (format) => {
    if (!format) return 'Unknown'
    
    // Convert from scanner format names to user-friendly names
    const formatMap = {
      'qr_code_reader': 'QR Code',
      'ean_reader': 'EAN',
      'ean_8_reader': 'EAN-8',
      'code_128_reader': 'Code 128',
      'code_39_reader': 'Code 39',
      'code_93_reader': 'Code 93',
      'upc_reader': 'UPC',
      'upc_e_reader': 'UPC-E',
      'codabar_reader': 'Codabar'
    }
    
    return formatMap[format] || format.replace(/_/g, ' ').replace('reader', '').trim()
  }