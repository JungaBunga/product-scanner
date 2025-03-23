import { useState, useCallback, useEffect } from 'react'

/**
 * Custom hook for clipboard operations
 * @param {string} text - Text to copy to clipboard
 * @param {number} timeout - Timeout in ms to reset copied state
 * @returns {Object} Clipboard state and methods
 */
const useClipboard = (text, timeout = 2000) => {
  const [hasCopied, setHasCopied] = useState(false)

  // Copy text to clipboard
  const copyToClipboard = useCallback(() => {
    if (!navigator?.clipboard) {
      // Fallback for older browsers
      try {
        const textArea = document.createElement("textarea")
        textArea.value = text
        textArea.style.position = "fixed"
        document.body.appendChild(textArea)
        textArea.focus()
        textArea.select()
        const successful = document.execCommand('copy')
        document.body.removeChild(textArea)
        setHasCopied(successful)
      } catch (error) {
        console.error('Failed to copy text: ', error)
        setHasCopied(false)
      }
    } else {
      // Modern clipboard API
      navigator.clipboard.writeText(text)
        .then(() => {
          setHasCopied(true)
        })
        .catch((error) => {
          console.error('Failed to copy text: ', error)
          setHasCopied(false)
        })
    }
  }, [text])

  // Reset copied state after timeout
  useEffect(() => {
    if (hasCopied && timeout) {
      const timerId = setTimeout(() => {
        setHasCopied(false)
      }, timeout)
      return () => clearTimeout(timerId)
    }
  }, [hasCopied, timeout])

  return { hasCopied, copyToClipboard }
}

export default useClipboard