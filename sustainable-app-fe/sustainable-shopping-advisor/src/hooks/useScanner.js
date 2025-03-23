import { useState, useEffect, useRef } from 'react'
import Quagga from 'quagga'

/**
 * Custom hook for handling QR/barcode scanning with Quagga
 * @param {Object} options - Scanner options
 * @param {Function} options.onDetected - Callback when code is detected
 * @param {Boolean} options.startOnMount - Whether to start scanner on mount
 * @returns {Object} Scanner methods and state
 */
const useScanner = ({ onDetected, startOnMount = false }) => {
  const [isScanning, setIsScanning] = useState(false)
  const [cameras, setCameras] = useState([])
  const [selectedCamera, setSelectedCamera] = useState(null)
  const [torchOn, setTorchOn] = useState(false)
  const scannerRef = useRef(null)

  // Get available cameras
  useEffect(() => {
    if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
      navigator.mediaDevices.enumerateDevices()
        .then(devices => {
          const videoDevices = devices.filter(device => device.kind === 'videoinput')
          setCameras(videoDevices)
          if (videoDevices.length > 0) {
            setSelectedCamera(videoDevices[0].deviceId)
          }
        })
        .catch(err => {
          console.error('Error enumerating devices', err)
        })
    }
  }, [])

  // Initialize scanner
  const initScanner = () => {
    if (!scannerRef.current) return

    Quagga.init({
      inputStream: {
        name: "Live",
        type: "LiveStream",
        target: scannerRef.current,
        constraints: {
          width: 640,
          height: 480,
          facingMode: "environment",
          deviceId: selectedCamera ? { exact: selectedCamera } : undefined
        },
      },
      locator: {
        patchSize: "medium",
        halfSample: true
      },
      numOfWorkers: navigator.hardwareConcurrency || 4,
      decoder: {
        readers: [
          "code_128_reader",
          "ean_reader",
          "ean_8_reader",
          "code_39_reader",
          "code_93_reader",
          "upc_reader",
          "upc_e_reader",
          "codabar_reader",
          "qr_code_reader"
        ]
      },
      locate: true
    }, function(err) {
      if (err) {
        console.error('Quagga initialization error', err)
        return
      }
      setIsScanning(true)
      Quagga.start()
    })

    // Set up detection handler
    Quagga.onDetected((result) => {
      if (result && result.codeResult) {
        if (onDetected) {
          onDetected({
            code: result.codeResult.code,
            format: result.codeResult.format,
            timestamp: new Date(),
          })
        }
      }
    })

    // Set up processing handler for drawing
    Quagga.onProcessed((result) => {
      const drawingCanvas = document.querySelector('.scanner-container canvas.drawingBuffer')
      if (drawingCanvas) {
        const ctx = drawingCanvas.getContext('2d')
        if (result) {
          if (result.boxes) {
            ctx.clearRect(0, 0, drawingCanvas.width, drawingCanvas.height)
            result.boxes.forEach((box) => {
              if (box !== result.box) {
                ctx.strokeStyle = 'green'
                ctx.lineWidth = 2
                ctx.strokeRect(box[0], box[1], box[2] - box[0], box[3] - box[1])
              }
            })
          }

          if (result.box) {
            ctx.strokeStyle = 'red'
            ctx.lineWidth = 2
            ctx.strokeRect(
              result.box.x,
              result.box.y,
              result.box.width,
              result.box.height
            )
          }

          if (result.codeResult && result.codeResult.code) {
            ctx.font = '24px Arial'
            ctx.fillStyle = 'red'
            ctx.fillText(result.codeResult.code, 10, 50)
          }
        }
      }
    })
  }

  // Start scanning
  const startScanner = () => {
    initScanner()
  }

  // Stop scanning
  const stopScanner = () => {
    if (isScanning) {
      Quagga.stop()
      setIsScanning(false)
    }
  }

  // Toggle torch
  const toggleTorch = () => {
    const stream = Quagga.CameraAccess.getActiveStream()
    if (stream) {
      const track = stream.getVideoTracks()[0]
      
      // Check if torch is supported
      if (track.getCapabilities && track.getCapabilities().torch) {
        track.applyConstraints({
          advanced: [{ torch: !torchOn }]
        }).then(() => {
          setTorchOn(!torchOn)
        }).catch(err => {
          console.error('Error toggling torch', err)
        })
      } else {
        console.warn('Torch not supported on this device')
      }
    }
  }

  // Toggle scanning
  const toggleScanner = () => {
    if (isScanning) {
      stopScanner()
    } else {
      startScanner()
    }
  }

  // Auto-start scanner if specified
  useEffect(() => {
    if (startOnMount) {
      startScanner()
    }

    // Cleanup on unmount
    return () => {
      stopScanner()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startOnMount])

  return {
    scannerRef,
    isScanning,
    cameras,
    selectedCamera,
    setSelectedCamera,
    torchOn,
    startScanner,
    stopScanner,
    toggleScanner,
    toggleTorch
  }
}

export default useScanner