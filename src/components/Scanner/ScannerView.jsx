import React, { useState, useEffect, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';

/**
 * Simplified scanner view that focuses on camera access first
 */
const ScannerView = ({ onScanSuccess, onScanError }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState(null);
  const [detailedError, setDetailedError] = useState(null);
  const [cameras, setCameras] = useState([]);
  const [selectedCamera, setSelectedCamera] = useState(null);
  const [manualCode, setManualCode] = useState('');
  const scannerRef = useRef(null);
  const html5QrCodeRef = useRef(null);
  
  // Check available cameras on mount
  useEffect(() => {
    const getCameras = async () => {
      try {
        const devices = await Html5Qrcode.getCameras();
        if (devices && devices.length) {
          setCameras(devices);
          setSelectedCamera(devices[0].id);
          console.log("Available cameras:", devices);
        } else {
          setError("No cameras found on this device");
        }
      } catch (err) {
        console.error("Error getting cameras:", err);
        setDetailedError(JSON.stringify(err, null, 2));
        setError("Could not access cameras. Check console for details.");
      }
    };
    
    getCameras();
    
    // Cleanup on unmount
    return () => {
      if (html5QrCodeRef.current && isScanning) {
        html5QrCodeRef.current.stop()
          .then(() => console.log("Scanner stopped"))
          .catch(err => console.error("Error stopping scanner:", err));
      }
    };
  }, []);
  
  // Start scanner with selected camera
  const startScanner = async () => {
    if (!selectedCamera) {
      setError("Please select a camera");
      return;
    }
    
    try {
      // Create a simple HTML element for the scanner if it doesn't exist
      if (!scannerRef.current.querySelector('#scanner-element')) {
        const scannerElement = document.createElement('div');
        scannerElement.id = 'scanner-element';
        scannerElement.style.width = '100%';
        scannerElement.style.height = '100%';
        scannerRef.current.appendChild(scannerElement);
      }
      
      // Initialize scanner with minimal config
      const html5QrCode = new Html5Qrcode('scanner-element');
      html5QrCodeRef.current = html5QrCode;
      
      // Very basic config - just get the camera working
      const config = {
        fps: 10,
        qrbox: { width: 250, height: 150 },
      };
      
      setError(null);
      setDetailedError(null);
      
      // Start with the selected camera
      await html5QrCode.start(
        { deviceId: selectedCamera },
        config,
        (decodedText, decodedResult) => {
          console.log("Barcode detected:", decodedText, decodedResult);
          
          if (onScanSuccess) {
            onScanSuccess({
              code: decodedText,
              format: decodedResult.result.format 
                ? decodedResult.result.format.toString() 
                : 'Unknown Format',
              timestamp: new Date()
            });
          }
          
          // Stop scanner after successful scan
          html5QrCode.stop().catch(err => console.error(err));
          setIsScanning(false);
        },
        (errorMessage) => {
          // This is for scan process errors (not critical)
          console.log("Scanning:", errorMessage);
        }
      );
      
      setIsScanning(true);
    } catch (err) {
      console.error("Scanner start error:", err);
      
      // Provide detailed error information
      let errorMsg = "Failed to start scanner: " + (err.message || "Unknown error");
      setError(errorMsg);
      
      // Save the full error details for debugging
      setDetailedError(JSON.stringify(err, null, 2));
    }
  };
  
  // Stop the scanner
  const stopScanner = async () => {
    if (html5QrCodeRef.current && isScanning) {
      try {
        await html5QrCodeRef.current.stop();
        setIsScanning(false);
      } catch (err) {
        console.error("Error stopping scanner:", err);
      }
    }
  };
  
  // Handle manual code submission
  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (manualCode.trim()) {
      if (onScanSuccess) {
        onScanSuccess({
          code: manualCode.trim(),
          format: 'Manual Entry',
          timestamp: new Date()
        });
      }
    }
  };
  
  // Handle test barcode
  const handleTestBarcode = (barcode) => {
    if (onScanSuccess) {
      onScanSuccess({
        code: barcode,
        format: 'Test Barcode',
        timestamp: new Date()
      });
    }
  };
  
  return (
    <div className="scanner-view">
      <div 
        ref={scannerRef}
        className="scanner-container"
        style={{
          position: 'relative',
          height: '300px',
          backgroundColor: '#f8fafc',
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
              padding: '1rem',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(247, 250, 252, 0.8)',
              zIndex: 10
            }}
          >
            <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>📷</div>
            <p style={{ textAlign: 'center', color: '#718096' }}>
              Select a camera and click "Start Scanner"
            </p>
          </div>
        )}
      </div>
      
      {/* Camera Selection */}
      {cameras.length > 0 && (
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ fontSize: '0.875rem', display: 'block', marginBottom: '0.5rem' }}>
            Select Camera:
          </label>
          <select 
            value={selectedCamera || ''}
            onChange={(e) => setSelectedCamera(e.target.value)}
            style={{
              width: '100%',
              padding: '0.5rem',
              borderRadius: '0.25rem',
              border: '1px solid #e2e8f0',
              marginBottom: '0.5rem'
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
      
      {/* Scanner Controls */}
      <div 
        style={{
          display: 'flex',
          gap: '0.5rem',
          marginBottom: '1rem'
        }}
      >
        <button
          onClick={isScanning ? stopScanner : startScanner}
          style={{
            backgroundColor: isScanning ? '#a0aec0' : '#4299e1',
            color: 'white',
            border: 'none',
            borderRadius: '0.25rem',
            padding: '0.5rem 1rem',
            fontSize: '1rem',
            fontWeight: '500',
            cursor: 'pointer',
            width: '100%'
          }}
          disabled={!selectedCamera && !isScanning}
        >
          {isScanning ? 'Stop Scanner' : 'Start Scanner'}
        </button>
      </div>
      
      {/* Error display */}
      {error && (
        <div 
          style={{
            padding: '0.75rem',
            backgroundColor: '#fff5f5',
            color: '#c53030',
            borderRadius: '0.25rem',
            marginBottom: '1rem',
            fontSize: '0.875rem'
          }}
        >
          <strong>Error:</strong> {error}
          
          {detailedError && (
            <details style={{ marginTop: '0.5rem', fontSize: '0.75rem' }}>
              <summary>Technical details (for developers)</summary>
              <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                {detailedError}
              </pre>
            </details>
          )}
        </div>
      )}
      
      {/* Test Barcodes */}
      <div style={{ marginBottom: '1rem' }}>
        <h4 style={{ fontSize: '0.875rem', marginBottom: '0.5rem' }}>Test with sample barcodes:</h4>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          <button 
            onClick={() => handleTestBarcode('5449000000996')}
            style={{
              padding: '0.25rem 0.5rem',
              backgroundColor: '#edf2f7',
              border: '1px solid #cbd5e0',
              borderRadius: '0.25rem',
              fontSize: '0.75rem'
            }}
          >
            Coca-Cola (5449000000996)
          </button>
          <button 
            onClick={() => handleTestBarcode('3017620425035')}
            style={{
              padding: '0.25rem 0.5rem',
              backgroundColor: '#edf2f7',
              border: '1px solid #cbd5e0',
              borderRadius: '0.25rem',
              fontSize: '0.75rem'
            }}
          >
            Nutella (3017620425035)
          </button>
        </div>
      </div>
      
      {/* Manual Entry */}
      <form 
        onSubmit={handleManualSubmit}
        style={{
          marginBottom: '1rem',
          padding: '0.75rem',
          backgroundColor: '#edf2f7',
          borderRadius: '0.25rem'
        }}
      >
        <h4 style={{ fontSize: '0.875rem', marginBottom: '0.5rem' }}>Manual barcode entry:</h4>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <input 
            type="text"
            value={manualCode}
            onChange={(e) => setManualCode(e.target.value)}
            placeholder="Enter barcode number..."
            style={{
              flex: 1,
              padding: '0.5rem',
              border: '1px solid #cbd5e0',
              borderRadius: '0.25rem',
              fontSize: '0.875rem'
            }}
          />
          <button
            type="submit"
            style={{
              backgroundColor: '#4299e1',
              color: 'white',
              border: 'none',
              borderRadius: '0.25rem',
              padding: '0.5rem 1rem',
              fontSize: '0.875rem',
              cursor: 'pointer'
            }}
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default ScannerView;