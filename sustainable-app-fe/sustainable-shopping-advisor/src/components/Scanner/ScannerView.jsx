import React, { useState } from 'react'
import { FaLightbulb, FaCamera } from 'react-icons/fa'
import useScanner from '../../hooks/useScanner'
import Button from '../UI/Button'

/**
 * Scanner view component
 * @param {Object} props - Component props
 * @param {Function} props.onScanSuccess - Callback when scan succeeds
 * @param {Function} props.onScanError - Callback when scan errors
 * @returns {JSX.Element} Scanner view component
 */
const ScannerView = ({ onScanSuccess, onScanError }) => {
  const [error, setError] = useState(null)
  
  const handleError = (err) => {
    setError(err)
    if (onScanError) {
      onScanError(err)
    }
  }
  
  const {
    scannerRef,
    isScanning,
    cameras,
    selectedCamera,
    setSelectedCamera,
    torchOn,
    startScanner,
    stopScanner,
    toggleTorch
  } = useScanner({
    onDetected: onScanSuccess,
    onError: handleError
  })
  
  return (
    <div className="scanner-view">
      <div 
        id="scanner-container"
        ref={scannerRef}
        className="scanner-container"
        style={{
          position: 'relative',
          height: '350px',
          backgroundColor: '#f7fafc',
          borderRadius: '0.5rem',
          overflow: 'hidden',
          border: '1px solid #e2e8f0',
          marginBottom: '1rem'
        }}
      >
        {!isScanning && (
          <div 
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              padding: '1rem'
            }}
          >
            <FaCamera 
              size={48} 
              color="#a0aec0" 
              style={{ marginBottom: '1rem' }}
            />
            <p style={{ textAlign: 'center', color: '#718096' }}>
              Click "Start Scanner" to begin scanning
            </p>
          </div>
        )}
      </div>
      
      <div 
        className="scanner-controls"
        style={{
          display: 'flex',
          gap: '0.5rem',
          marginBottom: '1rem'
        }}
      >
        <Button
          onClick={isScanning ? stopScanner : startScanner}
          variant={isScanning ? 'secondary' : 'primary'}
          fullWidth
        >
          {isScanning ? 'Stop Scanner' : 'Start Scanner'}
        </Button>
        
        {isScanning && (
          <Button
            onClick={toggleTorch}
            variant="outline"
            icon={<FaLightbulb />}
          >
            {torchOn ? 'Torch On' : 'Torch Off'}
          </Button>
        )}
      </div>
      
      {cameras.length > 1 && (
        <div className="camera-selector" style={{ marginBottom: '1rem' }}>
          <label 
            htmlFor="camera-select" 
            style={{ 
              display: 'block', 
              marginBottom: '0.5rem',
              fontSize: '0.875rem',
              fontWeight: 500
            }}
          >
            Select Camera
          </label>
          <select
            id="camera-select"
            value={selectedCamera || ''}
            onChange={(e) => setSelectedCamera(e.target.value)}
            style={{
              width: '100%',
              padding: '0.5rem',
              borderRadius: '0.25rem',
              border: '1px solid #e2e8f0',
              backgroundColor: 'white'
            }}
            disabled={isScanning}
          >
            {cameras.map((camera) => (
              <option key={camera.id} value={camera.id}>
                {camera.label || `Camera ${camera.id}`}
              </option>
            ))}
          </select>
        </div>
      )}
      
      {error && (
        <div 
          className="scanner-error"
          style={{
            padding: '0.5rem',
            backgroundColor: '#fff5f5',
            color: '#c53030',
            borderRadius: '0.25rem',
            marginBottom: '1rem',
            fontSize: '0.875rem'
          }}
        >
          {error}
        </div>
      )}
      
      <p 
        className="scanner-help"
        style={{
          fontSize: '0.875rem',
          color: '#718096',
          textAlign: 'center',
          margin: '1rem 0'
        }}
      >
        Position the QR code within the scanner area.
        Make sure it's well-lit and your camera is focused.
      </p>
    </div>
  )
}

export default ScannerView