import { useState, useCallback, useEffect } from 'react'

/**
 * Custom hook for handling clipboard operations
 * @param {string} text - Text to copy to clipboard
 * @param {number} timeout - Timeout in ms to reset copied state
 * @returns {Object} Clipboard methods and state
 */
const useClipboard = (text, timeout = 1500) => {
  const [hasCopied, setHasCopied] = useState(false)

  // Copy to clipboard function
  const onCopy = useCallback(() => {
    // Create a new textarea element to handle the copy
    const textarea = document.createElement('textarea')
    textarea.value = text
    textarea.style.position = 'fixed' // Avoid scrolling to bottom
    document.body.appendChild(textarea)
    textarea.focus()
    textarea.select()

    try {
      // Execute copy command
      const successful = document.execCommand('copy')
      setHasCopied(successful)
    } catch (err) {
      console.error('Failed to copy text: ', err)
      setHasCopied(false)
    }

    // Cleanup
    document.body.removeChild(textarea)
  }, [text])

  // Reset copied state after timeout
  useEffect(() => {
    if (hasCopied && timeout) {
      const id = setTimeout(() => {
        setHasCopied(false)
      }, timeout)
      return () => clearTimeout(id)
    }
  }, [hasCopied, timeout])

  return { hasCopied, onCopy }
}

export default useClipboard