import { useState, useEffect, useRef } from 'react'
import { Html5Qrcode } from 'html5-qrcode'

/**
 * Custom hook for QR code scanning using html5-qrcode
 * @param {Object} options - Hook options
 * @param {Function} options.onDetected - Callback on successful scan
 * @param {Function} options.onError - Callback on scan error
 * @returns {Object} Scanner methods and state
 */
const useScanner = ({ onDetected, onError }) => {
  const [isScanning, setIsScanning] = useState(false)
  const [cameras, setCameras] = useState([])
  const [selectedCamera, setSelectedCamera] = useState(null)
  const [torchOn, setTorchOn] = useState(false)
  const scannerRef = useRef(null)
  const html5QrCodeRef = useRef(null)

  // Get available cameras
  useEffect(() => {
    Html5Qrcode.getCameras()
      .then(devices => {
        if (devices && devices.length) {
          setCameras(devices)
          setSelectedCamera(devices[0].id)
        }
      })
      .catch(err => {
        console.error('Error getting cameras', err)
        if (onError) {
          onError('Unable to access camera. Please check permissions.')
        }
      })
  }, [onError])

  // Start scanner
  const startScanner = async () => {
    if (!scannerRef.current || !selectedCamera) return

    try {
      const html5QrCode = new Html5Qrcode("scanner-container")
      html5QrCodeRef.current = html5QrCode

      await html5QrCode.start(
        selectedCamera,
        {
          fps: 10,
          qrbox: { width: 250, height: 250 }
        },
        (decodedText, decodedResult) => {
          if (onDetected) {
            onDetected({
              code: decodedText,
              format: decodedResult.result.format ? decodedResult.result.format.toString() : 'QR Code',
              timestamp: new Date()
            })
          }
          // Don't stop scanner automatically after detection
          // to allow continuous scanning if needed
        },
        (errorMessage) => {
          // This is a silent error callback for scanning process
          // console.error("QR Code scanning error:", errorMessage)
        }
      )

      setIsScanning(true)
    } catch (err) {
      console.error('Error starting scanner:', err)
      if (onError) {
        onError('Failed to start scanner: ' + err.message)
      }
    }
  }

  // Stop scanner
  const stopScanner = async () => {
    if (html5QrCodeRef.current && isScanning) {
      try {
        await html5QrCodeRef.current.stop()
        setIsScanning(false)
        setTorchOn(false)
      } catch (err) {
        console.error('Error stopping scanner:', err)
      }
    }
  }

  // Toggle torch/flashlight
  const toggleTorch = async () => {
    if (!html5QrCodeRef.current || !isScanning) return

    try {
      const newTorchState = !torchOn
      await html5QrCodeRef.current.applyVideoConstraints({
        advanced: [{ torch: newTorchState }]
      })
      setTorchOn(newTorchState)
    } catch (err) {
      console.error('Error toggling torch:', err)
      if (onError) {
        onError('Your device may not support flashlight control.')
      }
    }
  }

  // Clean up
  useEffect(() => {
    return () => {
      if (html5QrCodeRef.current && isScanning) {
        html5QrCodeRef.current.stop()
          .catch(err => console.error('Error stopping scanner on unmount:', err))
      }
    }
  }, [isScanning])

  return {
    scannerRef,
    isScanning,
    cameras,
    selectedCamera,
    setSelectedCamera,
    torchOn,
    startScanner,
    stopScanner,
    toggleTorch
  }
}

export default useScanner